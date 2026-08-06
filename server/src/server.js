const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');
const connectDB = require("./config/dbConnect");
const seedSuperAdmin = require("./scripts/Seedsuperadmin");
const PORT = process.env.PORT || 5000;

//to connect mogodb
const startServer = async () => {
  await connectDB();
  await seedSuperAdmin();
  app.listen(PORT, () => {
    console.log(`DiGiWallet server running on port ${PORT}`);
  });
};

startServer();
