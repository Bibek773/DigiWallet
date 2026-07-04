const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    collegeCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    website: {
      type: String,
    },

    accreditation: {
      type: String,
    },

    establishedYear: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "inactive"],
      default: "pending",
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    issuedCredentials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credential",
      },
    ],
    keyPair:{
      publicKey:{
        type:String,
        required:true,
      },
      keyId:{
        type:String,
        required:true
      },
      algorithm:{
       type:String,
       default:"RSA"
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("College", collegeSchema);