const express = require('express');
const router = express.Router();

const {
  issueCredential,
  getIssuedCredentials,
  revokeCredential,
} = require('../controllers/credential.controller');
// Only college can issue/manage credentials
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
router.use(protect);
router.use(authorizeRoles("college"));
router.post('/issue', issueCredential);

router.get('/issued', getIssuedCredentials);

router.patch('/revoke/:credentialId', revokeCredential);


module.exports = router;
 


