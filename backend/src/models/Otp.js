const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Otp = sequelize.define(
  "Otp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "otps",
    timestamps: true,
  },
);

module.exports = Otp;
