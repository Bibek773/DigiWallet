const mongoose = require("mongoose");
const QRCode = require("qrcode");

const College = require("../models/college.model");
const Credential = require("../models/credential.model");
const User = require("../models/student.model");
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

const getGrade = (cgpa) => {
  if (cgpa >= 3.6) return "A+";
  if (cgpa >= 3.2) return "A";
  if (cgpa >= 2.8) return "B+";
  if (cgpa >= 2.4) return "B";
  if (cgpa >= 2.0) return "C+";
  return "C";
};

const safeCredential = (credential) => ({
  id: credential._id,
  studentName: credential.studentName,
  examRoll: credential.examRoll,
  registrationNumber: credential.registrationNumber,
  academicYear: credential.academicYear,
  grade: credential.grade,
  // credentialType: credential.credentialType,
   credentialType: 'CGPA',
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

    const student = await User.findOne({
      _id: req.body.studentId,
      College_Id: issuerCollegeId,
      role: "student",
      accountStatus: "approved",
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Select an approved student from your college.",
      });
    }

    const cgpa = Number(req.body.CGPA);
    if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 4) {
      return res.status(400).json({ success: false, message: "CGPA must be between 0.0 and 4.0." });
    }

    const credentialType = req.body.credentialType || "CGPA";

    const credentialInput = {
      studentName: student.Name?.trim(),
      examRoll: student.RollNo,
      registrationNumber: student.RegistrationNumber?.trim(),
      semester: req.body.semester?.trim().toLowerCase(),
      level: req.body.level?.trim() || "Bachelor",
      faculty: student.Faculty?.trim() || "Science and Technology",
      program: normalizeProgram(student.Program),
      batch: student.Batch?.trim() || "",
      collegeName: req.body.collegeName?.trim() || college.collegeName,
      CGPA: cgpa,
      academicYear: req.body.academicYear?.trim(),
      grade: getGrade(cgpa),
      credentialType,
      studentId: student._id,
      collegeId: issuerCollegeId,
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
      "academicYear",
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
      batch: credentialInput.batch,
      collegeName: credentialInput.collegeName,
      CGPA: credentialInput.CGPA,
      academicYear: credentialInput.academicYear,
      grade: credentialInput.grade,
      // credentialType: credentialInput.credentialType,
      credentialType:'CGPA',//cause for now we only have cgpa as credential
      studentId: student._id.toString(),
      collegeId: issuerCollegeId.toString(),
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
    // Keep the shareable link clean while marking scans of the generated QR code.
    const qrVerificationUrl = `${credential.verificationLink}?source=qr`;
    credential.qrCodeData = await QRCode.toDataURL(qrVerificationUrl);
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

exports.getMyCredentials = async (req, res) => {
  try {
    const studentId = req.user?.id;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const credentials = await Credential.find({ studentId }).sort({ createdAt: -1 });

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
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
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
 
 










