const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },

    role: {
      type: DataTypes.ENUM("CUSTOMER", "DEALER", "PLUMBER", "ADMIN"),
      allowNull: false,
      defaultValue: "CUSTOMER",
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    credit30Eligible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    credit90Eligible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
