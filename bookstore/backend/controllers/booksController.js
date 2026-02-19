// ================================================================
//  backend/controllers/booksController.js
// ================================================================
const pool = require("../config/db");

/**
 * GET /api/books
 * Optional query: ?category=nyt
 */
exports.getAllBooks = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = "SELECT * FROM books";
    const params = [];

    if (category && category !== "all") {
      sql += " WHERE category = ?";
      params.push(category);
    }

    sql += " ORDER BY id";
    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getAllBooks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/books/:id
 */
exports.getBookById = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM books WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getBookById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};