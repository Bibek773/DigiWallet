
// controllers/auth.controller.js
const mongoose = require("mongoose");
const User = require("../models/student.model");
const generateToken = require("../utils/generateTokens");

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const invalidIdResponse = (res) =>
  res.status(400).json({
    success: false,
    message: "Invalid ID",
  });

const toPublicUser = (user) => {
  const userObj = user.toObject();
  const email = userObj.email || userObj.Email;

  delete userObj.Password;
  delete userObj.Email;

  if (email) {
    userObj.email = email;
  }

  return userObj;
};

const isValidPhotoDataUrl = (value) =>
  typeof value === "string" &&
  /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(value);


// STUDENT SIGNUP — creates the account directly.
// Public route. Student provides all their own data + a password.
// Account starts as "pending" and cannot log in until the college
// manually approves it based on their own external records.

exports.studentSignup = async (req, res) => {
  try {
    const {
      Name,
      Email,
      Password,
      College_Id,        // the college they claim to belong to
      Faculty,
      Program,
      Batch,
      RegistrationNumber,
      RollNo,
      DOB,
      Photo,
    } = req.body;

    const normalizedEmail = normalizeEmail(Email ?? req.body.email);
    const password = Password ?? req.body.password;

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    if (Photo && !isValidPhotoDataUrl(Photo)) {
      return res.status(400).json({
        success: false,
        message: "Profile photo must be a valid image",
      });
    }

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { Email: normalizedEmail }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      Name,
      Email: normalizedEmail,
      email: normalizedEmail,
      Password: password,
      role: "student",
      College_Id,
      Faculty,
      Program,
      Batch,
      RegistrationNumber,
      RollNo,
      DOB,
      Photo: Photo || null,
      accountStatus: "pending", // explicit, even though it's the schema default
    });

    const userObj = toPublicUser(user);

    res.status(201).json({
      success: true,
      message: "Signup successful. Your account is pending approval from your college.",
      data: userObj,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// LOGIN — used by all three roles: super_admin, college, student

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const normalizedEmail = normalizeEmail(Email ?? req.body.email);
    const password=Password??req.body.password;
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { Email: normalizedEmail }],
    }).select("+Password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Block login based on account approval status — only meaningfully
    // applies to students; college/super_admin accounts skip review.
    if (user.role === "student") {
      if (user.accountStatus === "pending") {
        return res.status(403).json({
          success: false,
          message: "Your account is still pending approval from your college.",
        });
      }
      if (user.accountStatus === "rejected") {
        return res.status(403).json({
          success: false,
          message: user.rejectionReason
            ? `Your signup was rejected: ${user.rejectionReason}`
            : "Your signup was rejected by your college.",
        });
      }
    }

    if (user.Status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated. Contact your administrator.",
      });
    }

    // comparePassword — bcrypt.compare against stored hash (teammate's part)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.Name,
        email: user.email || user.Email,
        role: user.role,
        collegeId: user.College_Id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// SUPER ADMIN manually creates a "college" role login account

exports.createUserAccount = async (req, res) => {
  try {
    const { Name, Email, Password, role, College_Id } = req.body;
    const normalizedEmail = normalizeEmail(Email ?? req.body.email);

    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot create another super_admin through this endpoint",
      });
    }
    if (role === "student") {
      return res.status(400).json({
        success: false,
        message: "Student accounts are created via public signup, not this endpoint",
      });
    }

    if (!normalizedEmail || !Password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { Email: normalizedEmail }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      Name,
      Email: normalizedEmail,
      email: normalizedEmail,
      Password,
      role,
      College_Id,
      accountStatus: "approved", // college accounts skip the review flow
    });

    const userObj = toPublicUser(user);

    res.status(201).json({ success: true, data: userObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET current logged-in user's own profile

exports.getMe = async (req, res) => {
  try {
    if (!isValidId(req.user.id)) {
      return invalidIdResponse(res);
    }

    const user = await User.findById(req.user.id).populate(
      "College_Id",
      "collegeName collegeCode"
    );
    res.status(200).json({ success: true, data: user ? toPublicUser(user) : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
