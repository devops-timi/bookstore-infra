// ================================================================
//  backend/routes/books.js
// ================================================================
const express  = require("express");
const router   = express.Router();
const { getAllBooks, getBookById } = require("../controllers/booksController");

router.get("/",    getAllBooks);    // GET /api/books
router.get("/:id", getBookById);   // GET /api/books/:id

module.exports = router;