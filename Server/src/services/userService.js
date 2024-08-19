const User = require("../models/User");
const pool = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", (err, results) => {
      if (err) return reject(err);
      resolve(results.rows);
    });
  });
}
async function getUserById(id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM users WHERE id=${id}`, (err, results) => {
      if (err) return reject(err);
      if (results.rowCount > 0) {
        const row = results.rows[0];
        const user = new User(
          row.id,
          row.name,
          row.surname,
          row.username,
          row.email,
          row.password,
          row.datebirth,
          row.address,
          row.photo,
          row.role,
          row.type_id,
          row.brand_id
        );
        resolve(user);
      }
      return reject("User not found");
    });
  });
}
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email],
      (err, results) => {
        if (err) return reject(err);
        if (results.rowCount > 0) {
          const row = results.rows[0];
          const user = new User(
            row.id,
            row.name,
            row.surname,
            row.username,
            row.email,
            row.password,
            row.datebirth,
            row.address,
            row.photo,
            row.role,
            row.type_id,
            row.brand_id
          );
          resolve(user);
        }
        return reject("User not found");
      }
    );
  });
}

async function createUser(
  name,
  surname,
  username,
  email,
  password,
  dateBirth,
  address,
  photo,
  role,
  type_id,
  brand_id
) {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      `INSERT INTO users (name, surname, username, email, password, datebirth, address, photo, role, type_id,brand_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING *`,
      [
        name,
        surname,
        username,
        email,
        hashedPassword,
        dateBirth,
        address,
        photo,
        role,
        type_id,
        brand_id,
      ],
      (err, resault) => {
        if (err) return reject(err);
        return resolve(resault.rows[0]);
      }
    );
  });
}

async function updateUser(
  id,
  name,
  surname,
  username,
  email,
  password,
  dateBirth,
  address
) {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      "UPDATE users SET name = $1,surname= $2,username=$3,email=$4,password=$5,dateBirth=$6,address=$7 WHERE id = $8 RETURNING *",
      [name, surname, username, email, hashedPassword, dateBirth, address, id],
      (err, result) => {
        if (err) throw reject(err);
        return resolve(result.rows[0]);
      }
    );
  });
}

async function deleteUser(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
      if (err) throw reject(err);
      return resolve(`User with id=${1} successfully deleted`);
    });
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  getUserByEmail,
};
