const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "recommendationsystem",
  password: "password",
  port: 5433,
});

module.exports = pool;
