// TODO: MongoDB connection — Sprint 1
// const mongoose = require('mongoose');
// module.exports = connectDB = async () => { ... };
const mongoose=require("mongoose")
const connectDB= async ()=>{
    try {
      
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("mongoDb connected successfully")
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports=connectDB