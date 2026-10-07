const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase, sequelize } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PlumbMart API is running",
  });
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
