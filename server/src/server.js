const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');
const connectDB = require("./config/dbConnect");
const PORT = process.env.PORT || 5000;

//to connect mogodb
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`DiGiWallet server running on port ${PORT}`);
  });
};

startServer();
