const duckdb = require("duckdb");
const pool = require("../../db");

async function getRecommendations(userId) {
  const db = new duckdb.Database(":memory:");
  const conn = db.connect();

  await conn.run("INSTALL postgres;");
  await conn.run("LOAD postgres;");

  const postgresConnStr =
    "postgresql://postgres:neca2002@localhost:5433/recommendationsystem";
  await conn.run(`ATTACH '${postgresConnStr}' AS db (TYPE POSTGRES);`);
  const hasUserPurchaseHistory = await checkPurchaseHistoryByUser(userId, conn);

  if (hasUserPurchaseHistory) {
    const recommendedProducts = await recommendBasedOnHistory(userId, conn);
    if (recommendedProducts && recommendedProducts.length > 0) {
      return recommendedProducts;
    } else return await recommendForNewUser(userId, conn);
  } else {
    return await recommendForNewUser(userId, conn);
  }
}

async function checkPurchaseHistoryByUser(userId, conn) {
  return new Promise((resolve, reject) => {
    conn.all(
      `
    SELECT COUNT(*) as count 
    FROM db.public.purchaseHistory 
    WHERE user_id = ${userId};
`,
      (err, result) => {
        if (err) {
          return reject("");
        }
        resolve(Number(result[0].count));
      }
    );
  });
}
async function recommendBasedOnHistory(userId, conn) {
  return new Promise(async (resolve, reject) => {
    try {
      const similarUsers = await findSimilarUsers(userId, conn);
      const productMap = new Map();
      const userPurchasedProducts = await new Promise((resolve, reject) => {
        conn.all(
          `
          SELECT product_id 
          FROM db.public.purchasehistory
          WHERE user_id = $1;
        `,
          [userId],
          (err, result) => {
            if (err) return reject(err);
            resolve(result.map((row) => row.product_id));
          }
        );
      });
      const purchases = userPurchasedProducts.join(",");
      if (similarUsers.length > 0) {
        const users = similarUsers.join(",");
         const recommendedProducts = await new Promise((resolve, reject) => {
          conn.all(
            `
            SELECT DISTINCT p.id, p.name, p.description, p.price, p.photo,
                            COALESCE(AVG(r.rating), 0) AS average_rating
            FROM db.public.purchasehistory ph
            JOIN db.public.products p ON ph.product_id = p.id
            LEFT JOIN db.public.ratings r ON p.id = r.product_id
            WHERE ph.user_id IN (${users})
              AND p.id NOT IN (${purchases})
            GROUP BY p.id, p.name, p.description, p.price, p.photo
            ORDER BY average_rating DESC, p.price ASC
            LIMIT 10;
          `,
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        });

        recommendedProducts.forEach((product) => {
          productMap.set(product.id, product);
        });
      }
      if (productMap.size < 10) {
        let similarProducts = [];
        for (let productId of userPurchasedProducts) {
          const simProducts = await findSimilarProducts(productId, conn);
          similarProducts.push(...simProducts);
        }

        if (similarProducts.length > 0) {
          const additionalRecommendedProducts = await new Promise(
            (resolve, reject) => {
              conn.all(
                `
                SELECT DISTINCT p.id, p.name, p.description, p.price, p.photo,
                                COALESCE(AVG(r.rating), 0) AS average_rating
                FROM db.public.products p
                LEFT JOIN db.public.ratings r ON p.id = r.product_id
                WHERE p.id IN (${similarProducts.join(",")})
                  AND p.id NOT IN (${userPurchasedProducts.join(",")})
                GROUP BY p.id, p.name, p.description, p.price, p.photo
                ORDER BY average_rating DESC, p.price ASC
                LIMIT ${10 - productMap.size};
              `,
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                }
              );
            }
          );

          additionalRecommendedProducts.forEach((product) => {
            if (!productMap.has(product.id)) {
              productMap.set(product.id, product);
            }
          });
        }
      }

      const finalRecommendations = Array.from(productMap.values());
      if (finalRecommendations.length > 0) {
        resolve(finalRecommendations);
      } else {
        resolve(await recommendForNewUser(userId, conn));
      }
    } catch (err) {
      console.error("Error in recommendBasedOnHistory:", err);
      reject(err);
    }
  });
}

async function recommendForNewUser(userId, conn) {
  return new Promise((resolve, reject) => {
    conn.all(
      `
        SELECT type_id, brand_id 
        FROM db.public.users
        WHERE id = $1;
      `,
      [userId],
      (err, userPreferences) => {
        if (err) {
          return reject(err);
        }

        if (!userPreferences || userPreferences.length === 0) {
          console.log("Nema preferencija za korisnika");
          return resolve([]);
        }
        const { type_id, brand_id } = userPreferences[0];
        conn.all(
          `
            SELECT p.id, p.name, p.description, p.price, p.photo,
                   COALESCE(AVG(r.rating), 0) AS average_rating
            FROM db.public.products as p
            LEFT JOIN db.public.ratings as r
            ON p.id = r.product_id
            WHERE p.type_id = ${type_id} OR p.brand_id = ${brand_id}
            GROUP BY p.id, p.name, p.description, p.price, p.photo
            ORDER BY average_rating DESC, p.price ASC
            LIMIT 10;
          `,
          (err, recommendedProducts) => {
            if (err) {
              console.log(err);
              return reject(err);
            }
            resolve(recommendedProducts);
          }
        );
      }
    );
  });
}
async function findSimilarUsers(userId, conn) {
  try {
    const similarUsersBySameProductsPromise = new Promise((resolve, reject) => {
      conn.all(
        `
        SELECT ph2.user_id, 
       COALESCE(SUM(pr1.rating * pr2.rating) / 
       (NULLIF(SQRT(SUM(pr1.rating * pr1.rating)), 0) * NULLIF(SQRT(SUM(pr2.rating * pr2.rating)), 0)), 0) AS similarity_score
      FROM db.public.purchasehistory ph1
      JOIN db.public.ratings pr1
        ON ph1.product_id = pr1.product_id AND pr1.user_id = ph1.user_id
      JOIN db.public.purchasehistory ph2 
        ON ph1.product_id = ph2.product_id
      JOIN db.public.ratings pr2
        ON ph2.product_id = pr2.product_id AND pr2.user_id = ph2.user_id
      WHERE ph1.user_id = $1 
        AND ph1.user_id != ph2.user_id
      GROUP BY ph2.user_id
      ORDER BY similarity_score DESC
      LIMIT 10;
        `,
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.map((row) => row.user_id));
          reject(err);
        }
      );
    });
    const similarUsersBySimilarProductsPromise = new Promise(
      (resolve, reject) => {
        conn.all(
          `
        SELECT ph2.user_id,
        COALESCE(SUM(pr1.rating * pr2.rating) / 
       (NULLIF(SQRT(SUM(pr1.rating * pr1.rating)), 0) * NULLIF(SQRT(SUM(pr2.rating * pr2.rating)), 0)), 0) AS similarity_score
        FROM db.public.purchasehistory AS ph1
        JOIN db.public.productattributes AS pa1
          ON ph1.product_id = pa1.product_id
        JOIN db.public.productattributes AS pa2
          ON pa1.attribute_id = pa2.attribute_id AND pa1.value = pa2.value
        JOIN db.public.purchasehistory AS ph2
          ON pa2.product_id = ph2.product_id AND ph1.user_id != ph2.user_id
        JOIN db.public.ratings pr1
          ON pr1.product_id = ph1.product_id
        JOIN db.public.ratings pr2
          ON pr2.product_id = pa2.product_id AND pr2.user_id = ph2.user_id
        WHERE ph1.user_id = ${userId}
        GROUP BY ph2.user_id
        HAVING COUNT(DISTINCT pa2.attribute_id) >= 2
        ORDER BY similarity_score DESC;
        `,
          (err, result) => {
            if (err) return reject(err);
            resolve(result.map((row) => row.user_id));
          }
        );
      }
    );
    const [similarUserIdsByPurchase, similarUserIdsByAttributes] =
      await Promise.all([
        similarUsersBySameProductsPromise,
        similarUsersBySimilarProductsPromise,
      ]);
    const allSimilarUserIds = new Set([
      ...similarUserIdsByPurchase,
      ...similarUserIdsByAttributes,
    ]);

    return Array.from(allSimilarUserIds);
  } catch (error) {
    console.error("Error in finding similar users: ", error);
    throw error;
  }
}
async function findSimilarUsers2(userId, conn) {
  return new Promise((resolve, reject) => {
    conn.all(
      `SELECT similar_user_id 
       FROM db.public.similar_users 
       WHERE user_id = $1 
       ORDER BY similarity_score DESC 
       LIMIT 10`,
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.map((row) => row.similar_user_id));
      }
    );
  });
}
async function findSimilarProducts(productId, conn) {
  return new Promise((resolve, reject) => {
    conn.all(
      `
      SELECT pa2.product_id
      FROM db.public.productattributes AS pa1
      JOIN db.public.productattributes AS pa2
        ON pa1.attribute_id = pa2.attribute_id AND pa1.value = pa2.value
      WHERE pa1.product_id = $1 AND pa1.product_id != pa2.product_id
      GROUP BY pa2.product_id
      HAVING COUNT(DISTINCT pa1.attribute_id) >= 2
      `,
      [productId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.map((row) => row.product_id));
      }
    );
  });
}
module.exports = { getRecommendations, findSimilarUsers, findSimilarUsers2 };
