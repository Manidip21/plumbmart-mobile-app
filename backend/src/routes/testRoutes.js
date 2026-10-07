const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Authenticated user",
    user: {
      id: req.user.id,
      mobile: req.user.mobile,
      role: req.user.role,
    },
  });
});

router.get("/admin", protect, authorizeRoles("ADMIN"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

router.get("/dealer", protect, authorizeRoles("DEALER"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Dealer",
  });
});

module.exports = router;
