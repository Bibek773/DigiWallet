const express = require("express");
const router = express.Router();

const {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} = require("../controllers/admin.controller");

router.post("/college", createCollege);//here / shows http://localhost:5000/api/admin

router.get("/college", getAllColleges);

router.get("/college/:id", getCollegeById);

router.put("/college/:id", updateCollege);

router.delete("/college/:id", deleteCollege);

module.exports = router;