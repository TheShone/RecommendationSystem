const pool = require("../../db");

async function getProducts(page = 1) {
  try {
    const pageSize = 6;
    const totalCountQuery = `
      SELECT COUNT(*) 
      FROM products`;
    const productQuery = `
      SELECT * 
      FROM products 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2`;
    const totalCountResult = await pool.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);
    const productsResult = await pool.query(productQuery, [
      pageSize,
      (page - 1) * pageSize,
    ]);
    const products = productsResult.rows;
    return {
      products,
      page,
      pages: Math.ceil(totalCount / pageSize),
      hasMore: page < Math.ceil(totalCount / pageSize),
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
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
  photo,
  quantity
) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO products (name,description,price,brand_id,type_id,created_at,photo,quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        description,
        price,
        brand_id,
        type_id,
        created_at,
        photo,
        quantity,
      ],
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
  photo,
  quantity
) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE products SET name = $1,description= $2,price=$3,brand_id=$4,type_id=$5,created_at=$6, photo=$7, quantity=$8 WHERE id = $9 RETURNING *",
      [
        name,
        description,
        price,
        brand_id,
        type_id,
        created_at,
        photo,
        quantity,
        id,
      ],
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
