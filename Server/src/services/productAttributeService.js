const pool = require("../../db");

async function getProductAttributes(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM productAttributes pa JOIN attributes a ON pa.attribute_id=a.id WHERE pa.product_id=$1",
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      }
    );
  });
}
async function updateProductAttribute(product_id, attribute_id, value) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE productAttributes SET value=$1 WHERE product_id=$2 AND attribute_id=$3 RETURNING *`,
      [value, product_id, attribute_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function createProductAttribute(product_id, attribute_id, value) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO productAttributes (product_id, attribute_id, value) VALUES ($1,$2,$3) RETURNING *`,
      [product_id, attribute_id, value],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function deleteProductAttribute(product_id, attribute_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM productAttributes WHERE product_id=$1 AND attribute_id=$2",
      [product_id, attribute_id],
      (err, result) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
  getProductAttributes,
  createProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
};
