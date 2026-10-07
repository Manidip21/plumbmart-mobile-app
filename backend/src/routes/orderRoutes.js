const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const {
  checkout,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

// Place order
router.post("/checkout", authenticate, checkout);

// Get logged-in user's orders
router.get("/", authenticate, getOrders);

// Get a specific order
router.get("/:id", authenticate, getOrderById);

module.exports = router;
