const express = require("express");
const router = express.Router();
const protect=require("../middleware/auth.middleware");
const authorizeRoles=require("../middleware/role.middleware")
const {
    getCollegeDashboard,
    getStudents,
    getCredentials,
    getPendingRequests,
    getVerificationLogs,
    getCollegeProfile,
    updateCollegeProfile,
    updateSettings
} = require("../controllers/college.controller");

// Protect all college routes
router.use(protect);
router.use(authorizeRoles("college"));

/* when react calls:
get/api/college/dashboard , the request flow from frontend->sends jwt token
-> college.routes.js-> protect middleware->checks token->authorizeRoles("college")->getCollegeDashboard controller
so, a logged-in college account can access it
a student or superadmin cannot access it */

router.get("/dashboard", getCollegeDashboard);

router.get("/students", getStudents);

router.get("/credentials", getCredentials);

router.get("/pending-requests", getPendingRequests);

router.get("/verifications", getVerificationLogs);

router.get("/profile", getCollegeProfile);

router.put("/profile", updateCollegeProfile);

router.put("/settings", updateSettings);


module.exports = router;