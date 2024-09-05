const duckdb = require("duckdb");

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
    WHERE user_id = $1;
`,
      [userId],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject("Error while retriving PurchaseHistory");
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

      let userPurchasedProducts = [];
      await conn.all(
        `
        SELECT product_id 
        FROM db.public.purchasehistory
        WHERE user_id = $1
      `,
        [userId],
        (err, result) => {
          if (err) return reject(err);
          userPurchasedProducts = result.map((row) => row.product_id);

          if (similarUsers.length === 0) {
            return resolve([]);
          }
          const users = similarUsers.join(",");
          const purchases = userPurchasedProducts.join(",");
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
            LIMIT 10
          `,
            async (err, recommendedProducts) => {
              if (err) {
                return reject(err);
              }
              if (recommendedProducts.length < 10) {
                let similarProducts = [];

                for (let productId of userPurchasedProducts) {
                  const simProducts = await findSimilarProducts(
                    productId,
                    conn
                  );
                  similarProducts.push(...simProducts);
                }

                if (similarProducts.length > 0) {
                  const uniqueRecommendedProducts = [
                    ...new Map(
                      recommendedProducts.map((item) => [item.id, item])
                    ).values(),
                  ];

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
                    LIMIT ${10 - uniqueRecommendedProducts.length}
                  `,
                    (err, additionalRecommendedProducts) => {
                      if (err) return reject(err);

                      const finalRecommendations = [
                        ...uniqueRecommendedProducts,
                        ...additionalRecommendedProducts,
                      ];
                      if (finalRecommendations.length > 0)
                        resolve(finalRecommendations);
                      else resolve(recommendForNewUser(userId, conn));
                    }
                  );
                } else {
                  resolve(recommendedProducts);
                }
              } else {
                resolve(recommendedProducts);
              }
            }
          );
        }
      );
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
    const similarUsersByPurchasePromise = new Promise((resolve, reject) => {
      conn.all(
        `
        SELECT ph2.user_id
        FROM db.public.purchasehistory AS ph1
        JOIN db.public.purchasehistory AS ph2 
          ON ph1.product_id = ph2.product_id
        WHERE ph1.user_id = $1 AND ph1.user_id != ph2.user_id
        GROUP BY ph2.user_id
        HAVING COUNT(DISTINCT ph1.product_id) >= 1
        `,
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.map((row) => row.user_id));
          reject(err);
        }
      );
    });
    const similarUsersByAttributesPromise = new Promise((resolve, reject) => {
      conn.all(
        `
        SELECT DISTINCT ph2.user_id
        FROM db.public.purchasehistory AS ph1
        JOIN db.public.productattributes AS pa1
          ON ph1.product_id = pa1.product_id
        JOIN db.public.productattributes AS pa2
          ON pa1.attribute_id = pa2.attribute_id AND pa1.value = pa2.value
        JOIN db.public.purchasehistory AS ph2
          ON pa2.product_id = ph2.product_id AND ph1.user_id != ph2.user_id
        WHERE ph1.user_id = ${userId}
        GROUP BY ph2.user_id
        `,
        (err, result) => {
          if (err) return reject(err);
          resolve(result.map((row) => row.user_id));
        }
      );
    });
    const [similarUserIdsByPurchase, similarUserIdsByAttributes] =
      await Promise.all([
        similarUsersByPurchasePromise,
        similarUsersByAttributesPromise,
      ]);
    const allSimilarUserIds = new Set([
      ...similarUserIdsByPurchase,
      ...similarUserIdsByAttributes,
    ]);

    return Array.from(allSimilarUserIds);
  } catch (error) {
    console.error("Greška prilikom pronalaženja sličnih korisnika: ", error);
    throw error;
  }
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
module.exports = { getRecommendations };
