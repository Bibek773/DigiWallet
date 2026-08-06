const mongoose = require("mongoose");
const VerificationLog = require("../models/verificationLog");

exports.getAllVerificationLogs = async (req, res) => {
  try {
    const logs = await VerificationLog.find()
      .populate(
        "credentialId",
        "studentName registrationNumber examRoll credentialType status collegeName"
      )
      .populate("studentId", "Name Email RegistrationNumber RollNo")
      .sort({ verifiedAt: -1 });

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCredentialVerificationLogs = async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(credentialId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const logs = await VerificationLog.find({ credentialId })
      .populate(
        "credentialId",
        "studentName registrationNumber examRoll credentialType status collegeName"
      )
      .populate("studentId", "Name Email RegistrationNumber RollNo")
      .sort({ verifiedAt: -1 });

    if (!logs.length) {
      return res.status(404).json({
        success: false,
        message: "No verification logs found.",
      });
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
