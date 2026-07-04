/* const express = require('express');
const router = express.Router();

const {
  issueCredential,
  getIssuedCredentials,
  revokeCredential,
} = require('../controllers/credential.controller');

router.post('/issue', issueCredential);

router.get('/issued', getIssuedCredentials);

router.patch('/revoke/:credentialId', revokeCredential);


module.exports = router;
 */







// routes/credential.routes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getAllUsers,
  getUserById,
  approveStudent,
  rejectStudent,
  updateUser,
  deleteUser,
} = require("../controllers/credential.controller");

// college sees its own students (optionally ?status=pending), super_admin sees all
router.get("/", protect, authorizeRoles("super_admin", "college"), getAllUsers);
router.get("/:id", protect, authorizeRoles("super_admin", "college", "student"), getUserById);

// approval workflow — college only, scoped to their own claimed students
router.put("/:id/approve", protect, authorizeRoles("college"), approveStudent);
router.put("/:id/reject", protect, authorizeRoles("college"), rejectStudent);

router.put("/:id", protect, authorizeRoles("super_admin", "college"), updateUser);
router.delete("/:id", protect, authorizeRoles("super_admin", "college"), deleteUser);

module.exports = router;
