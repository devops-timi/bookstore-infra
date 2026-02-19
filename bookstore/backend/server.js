// ================================================================
//  backend/server.js — Express entry point
// ================================================================
require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const booksRouter  = require("./routes/books");
const ordersRouter = require("./routes/orders");

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ── Static frontend ── */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ── API routes ── */
app.use("/api/books",  booksRouter);
app.use("/api/orders", ordersRouter);

/* ── Health check ── */
app.get("/health", (_req, res) => res.json({ status: "ok" }));

/* ── Catch-all: serve index.html for SPA ── */
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✦ Folio API running → http://localhost:${PORT}`);
});

module.exports = app;