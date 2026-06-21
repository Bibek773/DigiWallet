const College = require("../models/college.model");

// Create
exports.createCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all
exports.getAllColleges = async (req, res) => {
  const colleges = await College.find();
  res.json(colleges);
};

// Get single
exports.getCollegeById = async (req, res) => {
  const college = await College.findById(req.params.id);
  res.json(college);
};

// Update
exports.updateCollege = async (req, res) => {
  const college = await College.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(college);
};

// Delete
exports.deleteCollege = async (req, res) => {
  await College.findByIdAndDelete(req.params.id);
  res.json({
    message: "College deleted successfully",
  });
};