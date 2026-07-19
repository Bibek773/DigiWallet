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
        examRoll: credential.examRoll,
        semester: credential.semester,
        level: credential.level,
        faculty: credential.faculty,
        program: credential.program,
        batch: credential.batch,
        collegeName: credential.collegeName,
        CGPA: credential.CGPA,
        academicYear: credential.academicYear,
        grade: credential.grade,
        credentialType: credential.credentialType,
        status: credential.status,
        issuedAt: credential.createdAt,
        revokedAt: credential.revokedAt,
        credentialData: {
          studentName: credential.credentialData?.studentName,
          examRoll: credential.credentialData?.examRoll,
          registrationNumber: credential.credentialData?.registrationNumber,
          semester: credential.credentialData?.semester,
          level: credential.credentialData?.level,
          faculty: credential.credentialData?.faculty,
          program: credential.credentialData?.program,
          batch: credential.credentialData?.batch,
          collegeName: credential.credentialData?.collegeName,
          CGPA: credential.credentialData?.CGPA,
          academicYear: credential.credentialData?.academicYear,
          grade: credential.credentialData?.grade,
          credentialType: credential.credentialData?.credentialType,
          issuedAt: credential.credentialData?.issuedAt,
        },
        issuerCollege: credential.issuerCollegeId?.collegeName,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
