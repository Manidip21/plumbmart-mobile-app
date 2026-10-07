const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase, sequelize } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const Category = require("./models/Category");
const Product = require("./models/Product");
const productRoutes = require("./routes/productRoutes");
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");
const cartRoutes = require("./routes/cartRoutes");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const User = require("./models/User");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PlumbMart API is running",
  });
});
Category.hasMany(Product, {
  foreignKey: "categoryId",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
});

User.hasMany(Order, {
  foreignKey: "userId",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`PlumbMart API running on port ${PORT}`);
  });
};

startServer();
