const mongoose = require("mongoose");

const College = require("../models/college.model");
const Credential = require("../models/credential.model");
const User = require("../models/student.model");
const generateKeyPair = require("../utils/keyGenerator");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const invalidIdResponse = (res) =>
  res.status(400).json({
    success: false,
    message: "Invalid ID",
  });

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const normalizeAddress = (address) => {
  if (typeof address === "string") {
    return { street: address.trim() };
  }

  if (!address || typeof address !== "object") {
    return {};
  }

  return address;
};

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

const toDashboardCredential = (credential) => ({
  id: credential._id,
  studentName: credential.studentName,
  registrationNumber: credential.registrationNumber,
  collegeName: credential.collegeName,
  program: credential.program,
  semester: credential.semester,
  CGPA: credential.CGPA,
  status: credential.status,
  keyId: credential.keyId,
  verificationLink: credential.verificationLink,
  createdAt: credential.createdAt,
  revokedAt: credential.revokedAt,
});

const buildDashboardMetrics = ({ users, colleges, credentials, verificationLogs }) => ({
  totalUsers: users.length,
  activeStudents: users.filter(
    (user) =>
      user.role === "student" &&
      user.Status === "active" &&
      user.accountStatus === "approved"
  ).length,
  colleges: colleges.length,
  issuedCredentials: credentials.length,
  verifications: verificationLogs.length,
});

const buildRecentActivity = ({ credentials, verificationLogs }) => {
  const issued = credentials.map((credential) => ({
    id: `issued-${credential.id}`,
    type: "Credential issued",
    title: credential.studentName,
    detail: `${credential.collegeName} issued ${credential.registrationNumber}`,
    status: credential.status,
    timestamp: credential.createdAt,
  }));

  return [...issued, ...verificationLogs]
    .filter((item) => item.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);
};

const buildCollegePayload = (body) => {
  const {
    collegeName,
    collegeCode,
    email,
    phoneNumber,
    address,
    website,
    accreditation,
    establishedYear,
    admin,
  } = body;

  return {
    collegeName,
    collegeCode,
    email: normalizeEmail(email),
    phoneNumber,
    address: normalizeAddress(address),
    website,
    accreditation,
    establishedYear,
    admin,
  };
};

const createCollegeRecord = async (body, status = "pending") => {
  const payload = buildCollegePayload(body);
  const existingCollege = await College.findOne({
    $or: [{ collegeCode: payload.collegeCode }, { email: payload.email }],
  });

  if (existingCollege) {
    const error = new Error("College already exists.");
    error.statusCode = 400;
    throw error;
  }

  const { publicKey, keyId } = generateKeyPair(payload.collegeCode);

  return College.create({
    ...payload,
    keyPair: {
      publicKey,
      keyId,
    },
    status,
  });
};

const createLinkedCollegeAccount = async (college, body) => {
  const name = body.adminName || body.Name;
  const email = normalizeEmail(body.loginEmail || body.Email);
  const password = body.initialPassword || body.Password;

  if (!name || !email || !password) {
    const error = new Error("Admin name, login email, and initial password are required.");
    error.statusCode = 400;
    throw error;
  }

  const account = await User.create({
    Name: name,
    Email: email,
    email,
    Password: password,
    role: "college",
    College_Id: college._id,
    accountStatus: "approved",
    Status: "active",
  });

  college.admin = account._id;
  await college.save();

  return account;
};

exports.createCollege = async (req, res) => {
  try {
    const college = await createCollegeRecord(req.body);

    res.status(201).json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCollegeWithAccount = async (req, res) => {
  let college;

  try {
    college = await createCollegeRecord(req.body, "verified");
    const account = await createLinkedCollegeAccount(college, req.body);

    res.status(201).json({
      success: true,
      message: "College and login account created successfully.",
      data: {
        college,
        account: toPublicUser(account),
      },
    });
  } catch (error) {
    if (college) {
      return res.status(error.statusCode || 207).json({
        success: false,
        message: `College created, but account creation failed: ${error.message}`,
        data: {
          partialFailure: true,
          college,
          account: null,
        },
      });
    }

    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCollegeAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const college = await College.findById(id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    if (college.admin) {
      return res.status(409).json({
        success: false,
        message: "College already has a linked login account.",
      });
    }

    const account = await createLinkedCollegeAccount(college, req.body);

    res.status(201).json({
      success: true,
      message: "College login account created successfully.",
      data: {
        college,
        account: toPublicUser(account),
      },
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const [users, colleges, credentials] = await Promise.all([
      User.find().populate("College_Id", "collegeName collegeCode"),
      College.find(),
      Credential.find().sort({ createdAt: -1 }),
    ]);
    const verificationLogs = [];
    const dashboardData = {
      users: users.map(toPublicUser),
      colleges,
      credentials: credentials.map(toDashboardCredential),
      verificationLogs,
    };

    res.json({
      success: true,
      message: "Admin dashboard data loaded.",
      data: {
        ...dashboardData,
        metrics: buildDashboardMetrics(dashboardData),
        recentActivity: buildRecentActivity(dashboardData),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();

    res.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const college = await College.findById(id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCollege = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const college = await College.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({
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

exports.deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const college = await College.findByIdAndDelete(id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const updates = { ...req.body };
    delete updates.Password;

    if (updates.status) {
      updates.Status = updates.status;
      delete updates.status;
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("College_Id", "collegeName collegeCode");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully.",
      data: toPublicUser(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.revokeCredential = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const credential = await Credential.findById(id);

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Credential not found.",
      });
    }

    if (credential.status === "revoked") {
      return res.status(409).json({
        success: false,
        message: "Credential is already revoked.",
        data: toDashboardCredential(credential),
      });
    }

    credential.status = "revoked";
    credential.revokedAt = new Date();
    await credential.save();

    res.json({
      success: true,
      message: "Credential revoked successfully.",
      data: toDashboardCredential(credential),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return invalidIdResponse(res);
    }

    const credential = await Credential.findByIdAndDelete(id);

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Credential not found.",
      });
    }

    res.json({
      success: true,
      message: "Credential deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
