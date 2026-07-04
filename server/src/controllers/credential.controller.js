const mongoose = require("mongoose");
const QRCode = require("qrcode");

const College = require("../models/college.model");
const Credential = require("../models/credential.model");
const { createCredentialHash } = require("../utils/hash");
const {
  SIGNATURE_ALGORITHM,
  readPrivateKey,
  signCredential,
} = require("../utils/signature");

const normalizeProgram = (program) => {
  if (!program) return program;
  const value = program.trim().toLowerCase();
  return value === "it" ? "IT" : value.charAt(0).toUpperCase() + value.slice(1);
};

const safeCredential = (credential) => ({
  id: credential._id,
  studentName: credential.studentName,
  examRoll: credential.examRoll,
  registrationNumber: credential.registrationNumber,
  semester: credential.semester,
  level: credential.level,
  faculty: credential.faculty,
  program: credential.program,
  collegeName: credential.collegeName,
  CGPA: credential.CGPA,
  issuerCollegeId: credential.issuerCollegeId,
  credentialData: credential.credentialData,
  dataHash: credential.dataHash,
  signature: credential.signature,
  keyId: credential.keyId,
  signatureAlgorithm: credential.signatureAlgorithm,
  verificationLink: credential.verificationLink,
  qrCodeData: credential.qrCodeData,
  status: credential.status,
  revokedAt: credential.revokedAt,
  createdAt: credential.createdAt,
  updatedAt: credential.updatedAt,
});

exports.issueCredential = async (req, res) => {
  try {
    const issuerCollegeId = req.user?.collegeId || req.body.issuerCollegeId;

    if (!issuerCollegeId || !mongoose.Types.ObjectId.isValid(issuerCollegeId)) {
      return res.status(400).json({
        success: false,
        message: "Valid issuerCollegeId is required.",
      });
    }

    const college = await College.findById(issuerCollegeId).select("collegeName keyPair");
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "Issuer college not found.",
      });
    }

    if (!college.keyPair?.keyId) {
      return res.status(400).json({
        success: false,
        message: "Issuer college does not have a signing key.",
      });
    }

    const credentialInput = {
      studentName: req.body.studentName?.trim(),
      examRoll: req.body.examRoll,
      registrationNumber: req.body.registrationNumber?.trim(),
      semester: req.body.semester?.trim().toLowerCase(),
      level: req.body.level?.trim() || "Bachelor",
      faculty: req.body.faculty?.trim() || "Science and Technology",
      program: normalizeProgram(req.body.program),
      collegeName: req.body.collegeName?.trim() || college.collegeName,
      CGPA: req.body.CGPA,
      issuerCollegeId,
    };

    const missingFields = [
      "studentName",
      "examRoll",
      "registrationNumber",
      "semester",
      "program",
      "collegeName",
      "CGPA",
    ].filter((field) => credentialInput[field] === undefined || credentialInput[field] === "");

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      });
    }

    const issuedAt = new Date().toISOString();
    const credentialData = {
      studentName: credentialInput.studentName.toUpperCase(),
      examRoll: Number(credentialInput.examRoll),
      registrationNumber: credentialInput.registrationNumber.toUpperCase(),
      semester: credentialInput.semester,
      level: credentialInput.level,
      faculty: credentialInput.faculty,
      program: credentialInput.program,
      collegeName: credentialInput.collegeName,
      CGPA: Number(credentialInput.CGPA),
      issuerCollegeId: issuerCollegeId.toString(),
      issuedAt,
    };

    const dataHash = createCredentialHash(credentialData);
    const privateKey = readPrivateKey(college.keyPair.keyId);
    const signature = signCredential(dataHash, privateKey);

    const credential = await Credential.create({
      ...credentialInput,
      examRoll: credentialData.examRoll,
      registrationNumber: credentialData.registrationNumber,
      studentName: credentialData.studentName,
      CGPA: credentialData.CGPA,
      credentialData,
      dataHash,
      signature,
      keyId: college.keyPair.keyId,
      signatureAlgorithm: SIGNATURE_ALGORITHM,
    });

    const clientUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
    credential.verificationLink = `${clientUrl}/verify/${credential._id}`;
    credential.qrCodeData = await QRCode.toDataURL(credential.verificationLink);
    await credential.save();

    await College.findByIdAndUpdate(issuerCollegeId, {
      $addToSet: { issuedCredentials: credential._id },
    });

    return res.status(201).json({
      success: true,
      message: "Credential issued successfully.",
      credential: safeCredential(credential),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getIssuedCredentials = async (req, res) => {
  try {
    const issuerCollegeId = req.user?.collegeId || req.query.issuerCollegeId;
    const filter =
      issuerCollegeId && mongoose.Types.ObjectId.isValid(issuerCollegeId)
        ? { issuerCollegeId }
        : {};

    const credentials = await Credential.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: credentials.length,
      credentials: credentials.map(safeCredential),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.revokeCredential = async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(credentialId)) {
      return res.status(404).json({
        success: false,
        message: "Credential not found.",
      });
    }

    const credential = await Credential.findById(credentialId);
    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Credential not found.",
      });
    }

    const issuerCollegeId = req.user?.collegeId || req.body.issuerCollegeId;
    if (
      issuerCollegeId &&
      credential.issuerCollegeId.toString() !== issuerCollegeId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only revoke credentials issued by your college.",
      });
    }

    if (credential.status === "revoked") {
      return res.status(409).json({
        success: false,
        message: "Credential is already revoked.",
        credential: safeCredential(credential),
      });
    }

    credential.status = "revoked";
    credential.revokedAt = new Date();
    await credential.save();

    return res.status(200).json({
      success: true,
      message: "Credential revoked successfully.",
      credential: safeCredential(credential),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
 
 










