const { Op } = require("sequelize");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Get all active categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        isActive: true,
      },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get products
const getProducts = async (req, res) => {
  try {
    const { categoryId, search } = req.query;

    const where = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      order: [["name", "ASC"]],
    });

    // Customers should NOT receive stock information
    const isDealer = req.user && req.user.role === "DEALER";

    const formattedProducts = products.map((product) => {
      const productData = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        category: product.Category,
      };

      if (isDealer) {
        productData.stock = product.stock;
      }

      return productData;
    });

    res.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        isActive: true,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const isDealer = req.user && req.user.role === "DEALER";

    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      category: product.Category,
    };

    if (isDealer) {
      productData.stock = product.stock;
    }

    res.json({
      success: true,
      data: productData,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

module.exports = {
  getCategories,
  getProducts,
  getProductById,
};
