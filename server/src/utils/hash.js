const crypto = require("crypto");

const canonicalize = (value) => {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = canonicalize(value[key]);
        return result;
      }, {});
  }

  return value;
};

const generateHash = (data) =>
  crypto
    .createHash("sha256")
    .update(JSON.stringify(canonicalize(data)))
    .digest("hex");

const createCredentialHash = (credentialData) => generateHash(credentialData);

module.exports = {
  canonicalize,
  generateHash,
  createCredentialHash,
};
