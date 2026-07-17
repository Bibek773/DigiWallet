const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function generateKeyPair(collegeCode) {
  // Generate RSA key pair
  { /*the "rsa" argument tells Node.js to generate an RSA public-private key pair*/}
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,

    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },

    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
});

  // Create key ID
  const keyId = `${collegeCode}_v1`;

  // Path to keys directory
  const keysDir = path.join(__dirname, "../../keys");

  // Create the keys folder if it doesn't exist
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }

  // Path to the private key file
  const privatePath = path.join(
    keysDir,
    `${keyId}_private.pem`
  );

  // Prevent overwriting an existing private key
  if (fs.existsSync(privatePath)) {
    throw new Error("Private key already exists for this college.");
  }

  // Save the private key
  fs.writeFileSync(privatePath, privateKey);

  // Return data to be stored in MongoDB
  return {
    publicKey,
    keyId,
  };
}

module.exports = generateKeyPair;


/*here controller prevents duplicate college registrations
 key generator prevents accidental overwriting of an existing private key file
 using RSA-Rivest Shamir Adleman */