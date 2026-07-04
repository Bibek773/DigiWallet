const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SIGNATURE_ALGORITHM = "RSA-SHA256";
const SIGNATURE_ENCODING = "base64";
const KEYS_DIR = path.resolve(__dirname, "../../keys");

const getPrivateKeyPath = (keyId) => {
  if (!keyId) {
    throw new Error("Key ID is required to sign credential.");
  }

  const privateKeyPath = path.resolve(KEYS_DIR, `${keyId}_private.pem`);
  const relativePath = path.relative(KEYS_DIR, privateKeyPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Invalid key ID.");
  }

  return privateKeyPath;
};

const readPrivateKey = (keyId) => {
  const privateKeyPath = getPrivateKeyPath(keyId);

  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`Private key not found for key ID: ${keyId}.`);
  }

  return fs.readFileSync(privateKeyPath, "utf8");
};

const signCredential = (hash, privateKey) => {
  const signer = crypto.createSign(SIGNATURE_ALGORITHM);
  signer.update(hash);
  signer.end();

  return signer.sign(privateKey, SIGNATURE_ENCODING);
};

const verifySignature = (hash, signature, publicKey) => {
  const verifier = crypto.createVerify(SIGNATURE_ALGORITHM);
  verifier.update(hash);
  verifier.end();

  return verifier.verify(publicKey, signature, SIGNATURE_ENCODING);
};

module.exports = {
  SIGNATURE_ALGORITHM,
  signCredential,
  verifySignature,
  readPrivateKey,
};
