const duckdb = require("duckdb");

async function calculateAndStoreSimilarUsers() {
  const db = new duckdb.Database(":memory:");
  const conn = db.connect();
  await conn.run("INSTALL postgres;");
  await conn.run("LOAD postgres;");
  const postgresConnStr =
    "postgresql://postgres:neca2002@localhost:5433/recommendationsystem";
  await conn.run(`ATTACH '${postgresConnStr}' AS db (TYPE POSTGRES);`);
  const allUser = await getAllUserIds(conn);
  const allUserIds = allUser.map((user) => user.id);
  for (const userId of allUserIds) {
    const similarUsersByPurchase = await findSimilarUsersByPurchase(
      userId,
      conn
    );
    const similarUsersByAttributes = await findSimilarUsersByAttributes(
      userId,
      conn
    );
    const combinedSimilarUsers = new Set([
      ...similarUsersByPurchase,
      ...similarUsersByAttributes,
    ]);
    await storeSimilarUsersInDatabase(userId, combinedSimilarUsers, conn);
  }

  console.log("Similar users calculation completed.");
  conn.close();
}
async function getAllUserIds(conn) {
  return new Promise((resolve, reject) => {
    conn.all(`SELECT id FROM db.public.users`, (err, users) => {
      if (err) return reject(err);
      resolve(users);
    });
  });
}
async function findSimilarUsersByPurchase(userId, conn) {
  return new Promise((resolve, reject) => {
    conn.all(
      `
      SELECT ph2.user_id, 
               SUM(ph1.rating * ph2.rating) / (SQRT(SUM(ph1.rating * ph1.rating)) * SQRT(SUM(ph2.rating * ph2.rating))) AS similarity_score
        FROM db.public.ratings ph1
        JOIN db.public.ratings ph2 
        ON ph1.product_id = ph2.product_id
        WHERE ph1.user_id = $1 
          AND ph1.user_id != ph2.user_id
        GROUP BY ph2.user_id
        ORDER BY similarity_score DESC
        LIMIT 10;
      `,
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
        reject(err);
      }
    );
  });
}
async function findSimilarUsersByAttributes(userId, conn) {
  return new Promise((resolve, reject) => {
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
        resolve(result);
      }
    );
  });
}
async function storeSimilarUsersInDatabase(userId, combinedSimilarUsers, conn) {
  if (combinedSimilarUsers.size === 0) {
    return;
  }

  for (let similarUser of combinedSimilarUsers) {
    const { user_id: similarUserId, similarity_score: similarityScore } =
      similarUser;

    const existsQuery = `
      SELECT 1 FROM db.public.similar_users 
      WHERE user_id = ${userId} AND similar_user_id = ${similarUserId}
    `;

    const exists = await new Promise((resolve, reject) => {
      conn.all(existsQuery, (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      });
    });

    if (exists) {
      const updateQuery = `
        UPDATE db.public.similar_users 
        SET similarity_score = ${similarityScore}
        WHERE user_id = ${userId} AND similar_user_id = ${similarUserId}
      `;
      await new Promise((resolve, reject) => {
        conn.run(
          updateQuery,
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    } else {
      const insertQuery = `
        INSERT INTO db.public.similar_users (user_id, similarity_score, similar_user_id)
        VALUES (${userId}, ${similarityScore}, ${similarUserId})
      `;
      await new Promise((resolve, reject) => {
        conn.run(
          insertQuery,
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }
  }
}

module.exports = { calculateAndStoreSimilarUsers };
