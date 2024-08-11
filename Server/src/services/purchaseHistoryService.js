const pool = require("../../db");

async function getPurchaseHistory(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM purchaseHistory ph JOIN products p on ph.product_id=p.id  WHERE user_id=${id}`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results.rows);
      }
    );
  });
}

async function createPurchaseHistory(user_id, product_id, purchase_date) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO purchaseHistory (user_id,product_id,purchase_date) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, product_id, purchase_date],
      (err, resault) => {
        if (err) return reject(err);
        return resolve(resault.rows[0]);
      }
    );
  });
}
async function deletePurchaseHistory(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM purchaseHistory WHERE id = $1",
      [id],
      (err, result) => {
        if (err) throw reject(err);
        return resolve(`Purchase with id=${1} successfully deleted`);
      }
    );
  });
}

module.exports = {
  getPurchaseHistory,
  createPurchaseHistory,
  deletePurchaseHistory,
};
