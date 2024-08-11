const pool = require("../../db");

async function getProducts() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM products", (err, results) => {
      if (err) return reject(err);
      resolve(results.rows);
    });
  });
}
async function getProductById(id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM products WHERE id=${id}`, (err, results) => {
      if (err) return reject(err);
      resolve(results.rows[0]);
    });
  });
}

async function createProduct(
  name,
  description,
  price,
  brand_id,
  type_id,
  created_at,
  photo
) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO products (name,description,price,brand_id,type_id,created_at,photo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, brand_id, type_id, created_at, photo],
      (err, resault) => {
        if (err) return reject(err);
        return resolve(resault.rows[0]);
      }
    );
  });
}

async function updateProduct(
  id,
  name,
  description,
  price,
  brand_id,
  type_id,
  created_at,
  photo
) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE products SET name = $1,description= $2,price=$3,brand_id=$4,type_id=$5,created_at=$6, photo=$7 WHERE id = $8 RETURNING *",
      [name, description, price, brand_id, type_id, created_at, photo, id],
      (err, result) => {
        if (err) throw reject(err);
        return resolve(result.rows[0]);
      }
    );
  });
}

async function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM products WHERE id = $1", [id], (err, result) => {
      if (err) throw reject(err);
      return resolve(`Product with id=${1} successfully deleted`);
    });
  });
}

module.exports = {
  getProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
};
