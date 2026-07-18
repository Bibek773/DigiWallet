// routes/auth.routes.js
const express = require("express");
const router = express.Router();

const {
  studentSignup,
  login,
  createUserAccount,
  getMe,
  changePassword,
} = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.post("/signup", studentSignup); // public — student creates their own pending account
router.post("/login", login);           // public — all roles

router.post("/create-account", protect, authorizeRoles("super_admin"), createUserAccount);
router.get("/me", protect, getMe);
router.patch("/change-password", protect, changePassword);

module.exports = router;
