const duckdb = require("duckdb");
const path = require("path");

const db = new duckdb.Database(":memory:");

function createTableUser() {
  try {
    db.run(`CREATE TABLE users (
      id UUID PRIMARY KEY,
      name VARCHAR,
      surname VARCHAR,
      username VARCHAR,
      email VARCHAR,
      password VARCHAR,
      dateBirth DATE,
      address VARCHAR
      )`);
  } catch (err) {
    console.log(`Greska ${err}`);
  }
}
function loadCSVData(tableName, csvFilePath) {
  return new Promise((resolve, reject) => {
    const query = `COPY ${tableName} FROM '${path.resolve(
      csvFilePath
    )}' (HEADER, DELIMITER ',')`;
    db.run(query, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
function runQuery(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, function (err, res) {
      if (err) {
        console.warn(err);
        return;
      }
      resolve(res);
    });
  });
}
function runUpdate(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
module.exports = {
  createTableUser,
  loadCSVData,
  runQuery,
  runUpdate,
};
