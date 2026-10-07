const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = require("../models/User");
const Otp = require("../models/Otp");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      mobile: user.mobile,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Mock OTP for assignment
    const otp = "123456";

    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // Temporary for assignment/demo
      demoOtp: otp,
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    const otpRecord = await Otp.findOne({
      where: {
        mobile,
        otp,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    let user = await User.findOne({
      where: { mobile },
    });

    if (!user) {
      user = await User.create({
        mobile,
        role: "CUSTOMER",
        isVerified: true,
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
