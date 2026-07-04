/* const express = require("express");
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

module.exports = router; */


const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  createCollege, getAllColleges, getCollegeById, updateCollege, deleteCollege,
} = require("../controllers/admin.controller");

router.post("/", protect, authorizeRoles("super_admin"), createCollege);
router.get("/", protect, authorizeRoles("super_admin"), getAllColleges);
router.get("/:id", protect, authorizeRoles("super_admin", "college"), getCollegeById);
router.put("/:id", protect, authorizeRoles("super_admin"), updateCollege);
router.delete("/:id", protect, authorizeRoles("super_admin"), deleteCollege);

module.exports = router;