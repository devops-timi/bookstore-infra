// ================================================================
//  backend/routes/orders.js
// ================================================================
const express  = require("express");
const router   = express.Router();
const { createOrder, getOrder } = require("../controllers/ordersController");

router.post("/",    createOrder);  // POST /api/orders
router.get("/:id",  getOrder);     // GET  /api/orders/:id

module.exports = router;