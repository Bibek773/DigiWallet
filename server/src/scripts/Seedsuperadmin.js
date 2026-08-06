/**
 * Seeds the first super_admin account from server/.env.
 *
 * How to run:
 *   cd server
 *   npm run seed:admin
 *
 * Required .env variables:
 *   MONGODB_URI
 *   SUPER_ADMIN_NAME
 *   SUPER_ADMIN_EMAIL
 *   SUPER_ADMIN_PASSWORD
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const User = require("../models/student.model");

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.SUPER_ADMIN_NAME;
const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const ADMIN_PASS = process.env.SUPER_ADMIN_PASSWORD;

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const missing = [];
if (!MONGODB_URI) missing.push("MONGODB_URI");
if (!ADMIN_NAME || !ADMIN_NAME.trim()) missing.push("SUPER_ADMIN_NAME");
if (!ADMIN_EMAIL || !ADMIN_EMAIL.trim()) missing.push("SUPER_ADMIN_EMAIL");
if (!ADMIN_PASS) missing.push("SUPER_ADMIN_PASSWORD");

if (missing.length > 0) {
  console.error("\nMissing required .env variables:");
  missing.forEach((variable) => console.error(`- ${variable}`));
  console.error("\nAdd them to server/.env and run the script again.\n");
  process.exit(1);
}

const normalizedEmail = normalizeEmail(ADMIN_EMAIL);

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
  console.error("\nSUPER_ADMIN_EMAIL must be a valid email address.\n");
  process.exit(1);
}

if (ADMIN_PASS.length < 6) {
  console.error("\nSUPER_ADMIN_PASSWORD must be at least 6 characters.\n");
  process.exit(1);
}

const seedSuperAdmin = async () => {
  try {
    const existingByEmail = await User.findOne({
      $or: [{ email: normalizedEmail }, { Email: normalizedEmail }],
    }).select("+Password");

    if (existingByEmail) {
      if (existingByEmail.role !== "super_admin") {
        throw new Error(
          `A ${existingByEmail.role} account already exists with SUPER_ADMIN_EMAIL. ` +
            "Use a different email or fix the existing account first."
        );
      }

      const passwordMatches = await existingByEmail.comparePassword(ADMIN_PASS);

      console.log(`\nSuper admin already exists: ${existingByEmail.email || existingByEmail.Email}`);
      console.log("No changes made. The script is safe to run multiple times.");

      if (!passwordMatches) {
        console.warn(
          "Warning: SUPER_ADMIN_PASSWORD does not match the existing account password."
        );
      }

      return;
    }

    const admin = await User.create({
      Name: ADMIN_NAME.trim(),
      Email: normalizedEmail,
      email: normalizedEmail,
      Password: ADMIN_PASS,
      role: "super_admin",
      College_Id: null,
      accountStatus: "approved",
      Status: "active",
    });

    console.log("\nSuper admin created successfully.");
    console.log(`Name : ${admin.Name}`);
    console.log(`Email: ${admin.email || admin.Email}`);
    console.log(`Role : ${admin.role}`);
    console.log(`ID   : ${admin._id}`);
    console.log("\nYou can now log in via POST /api/auth/login.\n");
  } catch (error) {
    console.error("\nSeed script failed:", error.message);

    if (error.code === 11000) {
      console.error(
        "A user with this email already exists. Use a different SUPER_ADMIN_EMAIL or check your database."
      );
    }

    process.exitCode = 1;
  }
};

module.exports = seedSuperAdmin;

if (require.main === module) {
  seedSuperAdmin();
}
