const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },

    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },

    Password: {
        type: String,
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

    College_Id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College',
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

userSchema.pre("save", async function () {
    if (!this.isModified("Password")) {
        return;
    }

    this.Password = await bcrypt.hash(this.Password, SALT_ROUNDS);
});

module.exports = mongoose.model("User", userSchema);
