const mongoose = require("mongoose");

const Credential = require("../models/credential.model");
const { createCredentialHash } = require("../utils/hash");
const { verifySignature } = require("../utils/signature");

const buildMessage = (result) => {
  if (result === "valid") return "Credential is valid.";
  if (result === "revoked") return "Credential has been revoked.";
  if (result === "tampered") return "Credential data has been tampered.";
  return "Credential signature is invalid.";
};

exports.verifyCredential = async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(credentialId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const credential = await Credential.findById(credentialId).populate(
      "issuerCollegeId",
      "collegeName keyPair"
    );

    if (!credential) {
      return res.status(404).json({
        success: false,
        result: "not_found",
        message: "Credential not found.",
      });
    }

    const recalculatedHash = createCredentialHash(credential.credentialData);
    const hashMatches = recalculatedHash === credential.dataHash;
    const publicKey = credential.issuerCollegeId?.keyPair?.publicKey;
    const signatureValid =
      Boolean(publicKey && credential.signature) &&
      verifySignature(credential.dataHash, credential.signature, publicKey);

    let result = "valid";
    if (credential.status === "revoked") {
      result = "revoked";
    } else if (!hashMatches) {
      result = "tampered";
    } else if (!signatureValid) {
      result = "invalid_signature";
    }

    return res.status(200).json({
      success: true,
      valid: result === "valid",
      result,
      message: buildMessage(result),
      checks: {
        hashMatches,
        signatureValid,
        status: credential.status,
      },
      credential: {
        id: credential._id,
        studentName: credential.studentName,
        registrationNumber: credential.registrationNumber,
        issuerCollege: credential.issuerCollegeId?.collegeName,
        dataHash: credential.dataHash,
        recalculatedHash,
        signature: credential.signature,
        keyId: credential.keyId,
        signatureAlgorithm: credential.signatureAlgorithm,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
