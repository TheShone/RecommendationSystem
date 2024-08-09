const brand = require("../models/Brand");
const pool = require("../../db");

async function getBrands() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM brands", (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
  });
}

async function getBrandById(id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM brands WHERE id=$1`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows[0]);
    });
  });
}
async function updateBrand(id, name) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE brands SET name=$1 WHERE id=$2 RETURNING *`,
      [name, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function createBrand(name) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO brands (name) VALUES ($1) RETURNING *`,
      [name],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function deleteBrand(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM brands WHERE id=$1", [id], (err, result) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
