require('dotenv').config();
const app = require('./app');
const connectDB=require("./config/db")
const PORT = process.env.PORT || 5000;

//to connect mogodb
connectDB()
app.listen(PORT, () => {
  console.log(`DiGiWallet server running on port ${PORT}`);
});
