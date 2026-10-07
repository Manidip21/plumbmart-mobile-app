const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },

    paymentMethod: {
      type: DataTypes.ENUM(
        "DIRECT_PAYMENT",
        "UPFRONT",
        "CREDIT_30",
        "CREDIT_90",
      ),
      allowNull: false,
    },

    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID", "CREDIT_APPROVED", "FAILED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  },
);

module.exports = Order;
