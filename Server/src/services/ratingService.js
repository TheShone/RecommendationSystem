const pool = require("../../db");

async function getRatings(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM ratings WHERE product_id=${id}`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results.rows);
      }
    );
  });
}

async function createRating(user_id, product_id, rating, review) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO ratings (user_id, product_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, product_id, rating, review],
      (err, resault) => {
        if (err) return reject(err);
        return resolve(resault.rows[0]);
      }
    );
  });
}

async function updateRating(id, user_id, product_id, rating, review) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE ratings SET user_id = $1,product_id= $2,rating=$3,review=$4 WHERE id = $5 RETURNING *",
      [user_id, product_id, rating, review, id],
      (err, result) => {
        if (err) throw reject(err);
        return resolve(result.rows[0]);
      }
    );
  });
}

async function deleteRating(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM ratings WHERE id = $1", [id], (err, result) => {
      if (err) throw reject(err);
      return resolve(`Rating with id=${1} successfully deleted`);
    });
  });
}

module.exports = {
  getRatings,
  updateRating,
  createRating,
  deleteRating,
};
