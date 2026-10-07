const express = require("express");

const {
  getCategories,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/categories", authenticate, getCategories);

router.get("/", authenticate, getProducts);

router.get("/:id", authenticate, getProductById);

module.exports = router;
