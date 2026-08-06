const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const {
  getAllVerificationLogs,
  getCredentialVerificationLogs,
} = require("../controllers/verificationLog.controller");

router.use(protect);
router.use(authorizeRoles("college"));

router.get("/logs", getAllVerificationLogs);
router.get("/logs/:credentialId", getCredentialVerificationLogs);

module.exports = router;
