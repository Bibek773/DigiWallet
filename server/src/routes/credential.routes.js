const express = require('express');
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
 


