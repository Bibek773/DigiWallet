const mongoose = require("mongoose");

const User = require("../models/student.model");

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

// Create
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: toPublicUser(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("College_Id", "name");
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const user = await User.findById(id).populate("College_Id", "name");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    delete req.body.Password;

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate("College_Id", "name");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
