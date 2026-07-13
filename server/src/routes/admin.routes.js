const express = require("express");
const router = express.Router();

const {
  createCollege,
  createCollegeAccount,
  createCollegeWithAccount,
  deleteCredential,
  getDashboard,
  getAllColleges,
  getCollegeById,
  deleteUser,
  revokeCredential,
  updateCollege,
  updateUser,
  deleteCollege,
} = require("../controllers/admin.controller");

router.get("/dashboard", getDashboard);

router.get("/colleges", getAllColleges);
router.post("/colleges", createCollegeWithAccount);
router.post("/colleges/:id/account", createCollegeAccount);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);

router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.patch("/credentials/:id/revoke", revokeCredential);
router.delete("/credentials/:id", deleteCredential);

router.post("/", createCollege);
router.get("/", getAllColleges);
router.get("/:id", getCollegeById);
router.put("/:id", updateCollege);
router.delete("/:id", deleteCollege);

module.exports = router; 

