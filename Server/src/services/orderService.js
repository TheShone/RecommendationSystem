const pool = require("../../db");

async function getOrdersByUserId(user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.rows);
      }
    );
  });
}
async function getOrderById(id) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM orders WHERE id = $1", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results.rows);
    });
  });
}
async function getOrders() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM orders", (err, results) => {
      if (err) return reject(err);
      resolve(results.rows);
    });
  });
}
async function createOrder(
  user_id,
  products,
  shipping_address,
  total_price,
  status
) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO orders (user_id, products, shipping_address, total_price, status) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        user_id,
        JSON.stringify(products),
        shipping_address,
        total_price,
        status,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}

async function updateOrderStatus(id, status) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      }
    );
  });
}

async function deleteOrder(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM orders WHERE id = $1", [id], (err, result) => {
      if (err) return reject(err);
      resolve(`Order with id=${id} successfully deleted`);
    });
  });
}


module.exports = {
  getOrdersByUserId,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
