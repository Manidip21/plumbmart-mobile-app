const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", authenticate, getCart);

router.post("/items", authenticate, addToCart);

router.put("/items/:id", authenticate, updateCartItem);

router.delete("/items/:id", authenticate, removeCartItem);

router.delete("/", authenticate, clearCart);

module.exports = router;
