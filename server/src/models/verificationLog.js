const mongoose = require("mongoose");

const verificationLogSchema = new mongoose.Schema({
  credentialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Credential",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  studentName: String,
  credentialType: String,
  actor: {
    type: String,
    default: "Public Verifier",
  },
  actorEmail: {
    type: String,
    default: null,
  },
  verificationMethod: {
    type: String,
    enum: ["QR", "Link"],
    required: true,
  },
  verificationStatus: {
    type: String,
    required: true,
  },
  verifiedAt: {
    type: Date,
    required: true,
  },
  ipAddress: {
    type: String,
    default: null,
  },
});

// Supports newest-first college activity after credential-based filtering.
verificationLogSchema.index({ credentialId: 1, verifiedAt: -1 });
verificationLogSchema.index({ verifiedAt: -1 });

module.exports = mongoose.model("VerificationLog", verificationLogSchema);
