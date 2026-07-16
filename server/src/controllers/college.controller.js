const mongoose = require("mongoose");

const User = require("../models/student.model");
const College = require("../models/college.model");
const Credential = require("../models/credential.model");


const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


// ============================
// College Dashboard
// ============================

exports.getCollegeDashboard = async (req, res) => {

    try {

        const collegeId = req.user.collegeId;

        if (!collegeId) {
            return res.status(400).json({
                success:false,
                message:"College account is not linked"
            });
        }


        const [
            students,
            pendingStudents,
            credentials
        ] = await Promise.all([

            User.countDocuments({
                College_Id: collegeId,
                role:"student"
            }),

            User.countDocuments({
                College_Id: collegeId,
                role:"student",
                accountStatus:"pending"
            }),

            Credential.countDocuments({
                collegeId: collegeId
            })

        ]);


        res.json({
            success:true,
            data:{
                students,
                pendingStudents,
                credentials,
                verificationRate:100
            }
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// Students
// ============================

exports.getStudents = async(req,res)=>{

    try{

        const collegeId = req.user.collegeId;


        const students = await User.find({
            College_Id:collegeId,
            role:"student"
        }).select("-Password");


        res.json({
            success:true,
            data:students
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// Credentials
// ============================

exports.getCredentials = async(req,res)=>{

    try{

        const collegeId = req.user.College_Id;


        const credentials = await Credential.find({
            collegeId:collegeId
        });


        res.json({
            success:true,
            data:credentials
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// Pending Requests
// ============================

exports.getPendingRequests = async(req,res)=>{

    try{

        const collegeId = req.user.College_Id;


        const requests = await User.find({

            College_Id:collegeId,
            role:"student",
            accountStatus:"pending"

        }).select("-Password");


        res.json({
            success:true,
            data:requests
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// Verification Logs
// ============================

exports.getVerificationLogs = async(req,res)=>{

    try{

        // If verification log schema exists later,
        // fetch using collegeId

        res.json({
            success:true,
            data:[]
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// College Profile
// ============================

exports.getCollegeProfile = async(req,res)=>{

    try{

        const collegeId = req.user.College_Id;


        const college = await College.findById(collegeId)
        .select("-keyPair.privateKey");


        if(!college){

            return res.status(404).json({
                success:false,
                message:"College not found"
            });

        }


        res.json({
            success:true,
            data:college
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// Update College Profile
// ============================

exports.updateCollegeProfile = async(req,res)=>{

    try{

        const collegeId = req.user.College_Id;


        const college = await College.findByIdAndUpdate(
            collegeId,
            req.body,
            {
                new:true,
                runValidators:true
            }
        );


        res.json({
            success:true,
            data:college
        });


    }catch(error){

        res.status(400).json({
            success:false,
            message:error.message
        });

    }

};



// ============================
// Settings
// ============================

exports.updateSettings = async(req,res)=>{

    try{

        const userId = req.user.id;


        const user = await User.findByIdAndUpdate(
            userId,
            req.body,
            {
                new:true
            }
        ).select("-Password");


        res.json({
            success:true,
            data:user
        });


    }catch(error){

        res.status(400).json({
            success:false,
            message:error.message
        });

    }

};