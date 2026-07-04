// TODO: MongoDB connection — Sprint 1
// const mongoose = require('mongoose');
// module.exports = connectDB = async () => { ... };
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
    process.exit(1);
  }
};

module.exports = dbConnect;
