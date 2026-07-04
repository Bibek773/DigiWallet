const express = require("express");
const router = express.Router();
const { verifyCredential } = require("../controllers/verify.controller");

router.get("/:credentialId", verifyCredential);

module.exports = router;
