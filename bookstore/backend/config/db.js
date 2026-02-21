// ================================================================
//  backend/config/db.js  — MySQL connection pool
// ================================================================
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || "folio_user",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "folio_bookstore",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

module.exports = pool;