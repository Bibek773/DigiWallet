/* const mongoose = require("mongoose");
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
 */












// controllers/credential.controller.js
const User = require("../models/student.model");

// ================================================================
// GET all students belonging to the logged-in college, optionally
// filtered by accountStatus (e.g. ?status=pending)
// super_admin sees everyone, across all colleges.
// ================================================================
exports.getAllUsers = async (req, res) => {
  try {
    const filter = { role: "student" };

    if (req.user.role === "college") {
      filter.College_Id = req.user.collegeId;
    }
    if (req.query.status) {
      filter.accountStatus = req.query.status; // pending | approved | rejected
    }

    const users = await User.find(filter).populate("College_Id", "collegeName collegeCode");
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single — with ownership checks
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("College_Id", "collegeName collegeCode");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.user.role === "student" && req.user.id !== String(user._id)) {
      return res.status(403).json({ success: false, message: "You can only access your own record" });
    }
    if (req.user.role === "college" && String(user.College_Id?._id || user.College_Id) !== String(req.user.collegeId)) {
      return res.status(403).json({ success: false, message: "This student does not belong to your college" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================================================
// APPROVE — college confirms a pending student is real, based on
// their own external records. Flips accountStatus to "approved",
// which is what unlocks the student's ability to log in.
// ================================================================
exports.approveStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // A college can only approve its own claimed students
    if (String(student.College_Id) !== String(req.user.collegeId)) {
      return res.status(403).json({
        success: false,
        message: "This student does not belong to your college",
      });
    }

    if (student.accountStatus === "approved") {
      return res.status(400).json({ success: false, message: "Student is already approved" });
    }

    student.accountStatus = "approved";
    student.rejectionReason = null; // clear any prior rejection note
    await student.save();

    res.json({
      success: true,
      message: "Student approved successfully. They can now log in.",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================================================
// REJECT — college determines the signup doesn't match a real
// student in their records. Optionally provide a reason.
// ================================================================
exports.rejectStudent = async (req, res) => {
  try {
    const { reason } = req.body;
    const student = await User.findById(req.params.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (String(student.College_Id) !== String(req.user.collegeId)) {
      return res.status(403).json({
        success: false,
        message: "This student does not belong to your college",
      });
    }

    student.accountStatus = "rejected";
    student.rejectionReason = reason || "Not verified against college records";
    await student.save();

    res.json({ success: true, message: "Student signup rejected.", data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update — college (own students) or super_admin (anyone)
exports.updateUser = async (req, res) => {
  try {
    // These fields are controlled only by their dedicated flows —
    // never editable through the generic update route.
    delete req.body.Password;
    delete req.body.accountStatus;
    delete req.body.role;

    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.user.role === "college" && String(target.College_Id) !== String(req.user.collegeId)) {
      return res.status(403).json({ success: false, message: "This student does not belong to your college" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("College_Id", "collegeName collegeCode");

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete — college (own students) or super_admin
exports.deleteUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.user.role === "college" && String(target.College_Id) !== String(req.user.collegeId)) {
      return res.status(403).json({ success: false, message: "This student does not belong to your college" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};