// ================================================================
//  backend/controllers/ordersController.js
// ================================================================
const pool = require("../config/db");

/**
 * POST /api/orders
 * Body: { items: [{ bookId, qty }] }
 */
exports.createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total from DB prices (never trust client-side prices)
    let total = 0;
    for (const item of items) {
      const [rows] = await conn.execute(
        "SELECT price, stock FROM books WHERE id = ?",
        [item.bookId]
      );
      if (rows.length === 0) {
        await conn.rollback();
        conn.release();
        return res
          .status(404)
          .json({ success: false, message: `Book ${item.bookId} not found` });
      }
      if (rows[0].stock < item.qty) {
        await conn.rollback();
        conn.release();
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for book ${item.bookId}`,
        });
      }
      total += rows[0].price * item.qty;
    }

    await conn.beginTransaction();

    // Insert order
    const [orderResult] = await conn.execute(
      "INSERT INTO orders (total, status, created_at) VALUES (?, 'confirmed', NOW())",
      [total.toFixed(2)]
    );
    const orderId = orderResult.insertId;

    // Insert order items and decrement stock
    for (const item of items) {
      const [rows] = await conn.execute(
        "SELECT price FROM books WHERE id = ?",
        [item.bookId]
      );
      await conn.execute(
        "INSERT INTO order_items (order_id, book_id, qty, unit_price) VALUES (?, ?, ?, ?)",
        [orderId, item.bookId, item.qty, rows[0].price]
      );
      await conn.execute(
        "UPDATE books SET stock = stock - ? WHERE id = ?",
        [item.qty, item.bookId]
      );
    }

    await conn.commit();
    conn.release();

    res.status(201).json({
      success: true,
      data: { orderId, total: total.toFixed(2), status: "confirmed" },
    });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("createOrder error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/orders/:id
 */
exports.getOrder = async (req, res) => {
  try {
    const [orders] = await pool.execute("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const [items] = await pool.execute(
      `SELECT oi.*, b.title, b.author
       FROM order_items oi
       JOIN books b ON b.id = oi.book_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    console.error("getOrder error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};