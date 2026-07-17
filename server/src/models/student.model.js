// models/student.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        sparse: true,
        select: false,
    },
    Password: {
        type: String,
        // Required again — student sets their own password directly at
        // signup now; there is no separate "activation" step.
        required: [true, 'Password needed'],
        minlength: [6, 'Password must contain at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: {
            values: ['super_admin', 'college', 'student'],
            message: '{VALUE} is not a valid role',
        },
        required: [true, 'Role is required'],
    },
    // The college the student CLAIMS to belong to at signup.
    // Not verified against any pre-existing college record automatically —
    // it's a claim the college later checks manually (approve/reject).
    College_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        default: null,
    },

    // ===== Student academic identity (self-submitted at signup) =====
    Faculty: {
        type: String,
        trim: true,
    },
    Program: {
        type: String,
        trim: true,
    },
    Batch: {
        type: String,
        trim: true,
    },
    RegistrationNumber: {
        type: String,
        trim: true,
    },
    RollNo: {
        type: String,
        trim: true,
    },
    DOB: {
        type: Date,
    },

    // pending  = student signed up, college hasn't reviewed yet (default)
    // approved = college confirmed this is a real student, can now log in
    // rejected = college determined this signup is not a real/valid student
    accountStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    // Optional note from college explaining why an account was rejected
    rejectionReason: {
        type: String,
        trim: true,
        default: null,
    },

    Status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});

userSchema.pre("validate", function (next) {
    const normalizedEmail = typeof this.Email === "string"
        ? this.Email.trim().toLowerCase()
        : typeof this.email === "string"
            ? this.email.trim().toLowerCase()
            : "";

    if (normalizedEmail) {
        this.Email = normalizedEmail;
        this.email = normalizedEmail;
    }

    next();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("Password") || !this.Password) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.Password) {
        return false;
    }

    if (typeof this.Password === "string" && this.Password.startsWith("$2")) {
        return bcrypt.compare(candidatePassword, this.Password);
    }

    return this.Password === candidatePassword;
};

module.exports = mongoose.model("User", userSchema);
