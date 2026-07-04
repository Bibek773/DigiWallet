const express = require("express");
const router = express.Router();

const {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} = require("../controllers/admin.controller");

router.post("/", createCollege);

router.get("/", getAllColleges);

router.get("/:id", getCollegeById);

router.put("/:id", updateCollege);

router.delete("/:id", deleteCollege);

module.exports = router; 

