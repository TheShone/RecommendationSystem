const pool = require("../../db");

async function getAttributes() {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT a.id,a.name as attributeName,p.name as Categorie, p.id as type_id FROM attributes as a left join producttype as p on a.type_id=p.id ORDER BY id ASC ",
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      }
    );
  });
}

async function getAttributeById(id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM attributes WHERE id=$1`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows[0]);
    });
  });
}
async function updateAttribute(id, name, id2) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE attributes SET name=$1,type_id=$2 WHERE id=$3 RETURNING *`,
      [name, id2, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function createAttribute(name, type_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO attributes (name,type_id) VALUES ($1,$2) RETURNING *`,
      [name, type_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}
async function deleteAttribute(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM attributes WHERE id=$1", [id], (err, result) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  getAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};
