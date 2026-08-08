
const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    uppercase: true,
  },
  examRoll: {
    type: Number,
    required: true,
  },
  registrationNumber: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
  },
  semester: {
    type: String,
    enum: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"],
    required: [true, "Semester is required"],
  },
  level: {
    type: String,
    default: "Bachelor",
  },
  faculty: {
    type: String,
    default: "Science and Technology",
  },
  program: {
    type: String,
    enum: ["Computer", "Civil", "Electrical", "IT"],
    required: [true, "Program is required"],
  },
  batch: {
    type: String,
    trim: true,
    default: '',
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
  },
  credentialType: {
    type: String,
    enum:['CGPA'],
    trim: true,
    default: 'CGPA',
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  collegeName: {
    type: String,
    required: [true, "College name is required"],
  },
  CGPA: {
    type: Number,
    required: [true, "Gpa is required"],
  },
   issuerCollegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: [true, 'Issuer college is required'],
    },
    credentialData: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Credential data snapshot is required'],
    },
    dataHash: {
      type: String,
      required: [true, 'Data hash is required'],
    },
    signature: {
      type: String,
      required: [true, 'Digital signature is required'],
    },
    keyId: {
      type: String,
      default: '',
    },
    signatureAlgorithm: {
      type: String,
      default: 'RSA-SHA256',
    },
    verificationLink: {
      type: String,
      default: '',
    },
    qrCodeData: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['valid', 'revoked'],
        message: '{VALUE} is not a valid credential status',
      },
      default: 'valid',
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt (= issuedAt) and updatedAt
    timestamps: true,
  }
);

credentialSchema.index(
  { registrationNumber: 1, semester: 1, credentialType: 1 },
  { unique: true }
);


module.exports = mongoose.model("Credential", credentialSchema);
