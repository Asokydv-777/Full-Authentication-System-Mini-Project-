const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/request-reset", authController.requestPasswordReset);
router.post("/complete-reset", authController.completePasswordReset);


router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "This is your profile.", user: req.user });
});


router.get(
  "/admin/dashboard",
  verifyToken,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Welcome to the admin dashboard." });
  },
);

module.exports = router;
