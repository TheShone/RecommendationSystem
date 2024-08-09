const brand = require("../models/Brand");
const pool = require("../../db");

async function getProductTypes() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM productType", (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
  });
}

async function getProductTypeById(id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM productType WHERE id=$1`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows[0]);
    });
  });
}
async function updateProductType(id, name) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE productType SET name=$1 WHERE id=$2 RETURNING *`,
      [name, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function createProductType(name) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO productType (name) VALUES ($1) RETURNING *`,
      [name],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function deleteProductType(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM productType WHERE id=$1", [id], (err, result) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  getProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
};
