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
async function getAllProducts() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM products", (err, results) => {
      if (err) return reject(err);
      resolve(results.rows);
    });
  });
}
async function getTopProducts() {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT p.id, p.name, p.description, p.price, p.photo,p.quantity,p.created_at,b.name as brand,c.name as category,COALESCE(AVG(r.rating), 0) AS average_rating, COALESCE(COUNT(r.rating),0) AS numReviews FROM products as p LEFT JOIN ratings as r ON p.id = r.product_id LEFT JOIN brands as b ON p.brand_id = b.id LEFT JOIN producttype as c ON p.type_id = c.id GROUP BY p.id, p.name, p.description, p.price, p.photo, b.name, c.name ORDER BY average_rating DESC, p.price ASC LIMIT 4",
      (err, results) => {
        if (err) return reject(err);
        resolve(results.rows);
      }
    );
  });
}
async function getFilteredProducts(checked, radio) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT p.id, p.name, p.description, p.price, p.photo, p.quantity, p.created_at, 
             b.name AS brand, c.name AS category, 
             COALESCE(AVG(r.rating), 0) AS average_rating, 
             COALESCE(COUNT(r.rating), 0) AS numReviews 
      FROM products AS p 
      LEFT JOIN ratings AS r ON p.id = r.product_id 
      LEFT JOIN brands AS b ON p.brand_id = b.id 
      LEFT JOIN producttype AS c ON p.type_id = c.id 
    `;

    const values = [];
    const conditions = [];

    if (checked && checked.length > 0) {
      conditions.push(`c.id = ANY($${values.length + 1})`);
      values.push(checked);
    }

    if (radio && radio.length === 2) {
      conditions.push(
        `p.price BETWEEN $${values.length + 1} AND $${values.length + 2}`
      );
      values.push(radio[0], radio[1]);
    }

    if (conditions.length > 0) {
      query += `WHERE ${conditions.join(" AND ")} `;
    }

    query += `
      GROUP BY p.id, b.name, c.name 
      ORDER BY average_rating DESC, p.price ASC
    `;

    pool.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results.rows);
    });
  });
}
async function getProductById(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT p.id, p.name, p.description, p.price, p.photo,p.quantity,p.created_at,b.name as brand,c.name as category,COALESCE(AVG(r.rating), 0) AS average_rating, COALESCE(COUNT(r.rating),0) AS numReviews FROM products as p LEFT JOIN ratings as r ON p.id = r.product_id LEFT JOIN brands as b ON p.brand_id = b.id LEFT JOIN producttype as c ON p.type_id = c.id WHERE p.id=${id} GROUP BY p.id, p.name, p.description, p.price, p.photo, b.name, c.name`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results.rows[0]);
      }
    );
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
  getTopProducts,
  getFilteredProducts,
  getAllProducts,
  updateProduct,
  createProduct,
  deleteProduct,
};
