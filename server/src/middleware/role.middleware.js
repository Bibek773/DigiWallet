// TODO: restrictTo(...roles) — role guard — Sprint 1

// middleware/role.middleware.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. '${req.user.role}' role cannot access this resource.`,
      });
    }
    next();
  };
};

module.exports = authorizeRoles;