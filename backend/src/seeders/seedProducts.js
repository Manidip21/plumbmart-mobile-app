const { sequelize } = require("../config/database");
const Category = require("../models/Category");
const Product = require("../models/Product");

const seedProducts = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected.");

    // Clear existing product/category data
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // Create categories
    const categories = await Category.bulkCreate([
      {
        name: "Pipes",
        description: "PVC, CPVC and other plumbing pipes",
      },
      {
        name: "Fittings",
        description: "Elbows, tees, couplers and other fittings",
      },
      {
        name: "Taps & Faucets",
        description: "Kitchen and bathroom taps and faucets",
      },
      {
        name: "Bathroom Accessories",
        description: "Bathroom plumbing accessories",
      },
      {
        name: "Water Tanks",
        description: "Water storage tanks",
      },
    ]);

    const categoryMap = {};

    categories.forEach((category) => {
      categoryMap[category.name] = category.id;
    });

    // Create products
    await Product.bulkCreate([
      {
        name: "PVC Pipe 1 Inch",
        description: "High-quality PVC plumbing pipe",
        price: 250.0,
        stock: 120,
        categoryId: categoryMap["Pipes"],
      },
      {
        name: "PVC Elbow 1 Inch",
        description: "PVC 90-degree elbow fitting",
        price: 35.0,
        stock: 250,
        categoryId: categoryMap["Fittings"],
      },
      {
        name: "Brass Ball Valve",
        description: "Durable brass ball valve",
        price: 450.0,
        stock: 75,
        categoryId: categoryMap["Fittings"],
      },
      {
        name: "Kitchen Faucet",
        description: "Modern single-lever kitchen faucet",
        price: 1299.0,
        stock: 40,
        categoryId: categoryMap["Taps & Faucets"],
      },
      {
        name: "Bathroom Tap",
        description: "Chrome-finished bathroom tap",
        price: 699.0,
        stock: 65,
        categoryId: categoryMap["Taps & Faucets"],
      },
      {
        name: "Bathroom Shower Set",
        description: "Complete bathroom shower set",
        price: 1899.0,
        stock: 25,
        categoryId: categoryMap["Bathroom Accessories"],
      },
      {
        name: "Water Tank 500L",
        description: "500 litre household water storage tank",
        price: 6499.0,
        stock: 15,
        categoryId: categoryMap["Water Tanks"],
      },
    ]);

    console.log("Categories and products seeded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
