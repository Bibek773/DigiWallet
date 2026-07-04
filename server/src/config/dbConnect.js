
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not set. Create server/.env from server/.env.example and add your MongoDB connection string."
      );
    }

    await mongoose.connect(mongoUri);
    console.log("mongoDb connected successfully");
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("different case")) {
      console.error(
        "MongoDB database names are case-sensitive on this setup. Make sure the database name in MONGODB_URI matches the existing database exactly."
      );
    }
    process.exit(1);
  }
};

module.exports = dbConnect;
