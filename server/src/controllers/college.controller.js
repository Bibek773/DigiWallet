const mongoose = require("mongoose");

const User = require("../models/student.model");
const College = require("../models/college.model");
const Credential = require("../models/credential.model");


const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildRecentActivity = ({ students, credentials }) => {
    const studentActivity = students.flatMap((student) => {
        const activities = [{
            id: `student-registered-${student._id}`,
            type: "Student registration",
            detail: `${student.Name} submitted a registration request.`,
            timestamp: student.createdAt
        }];

        if (student.accountStatus === "approved") {
            activities.push({
                id: `student-approved-${student._id}`,
                type: "Student approved",
                detail: `${student.Name} was approved.`,
                timestamp: student.updatedAt
            });
        }

        return activities;
    });

    const credentialActivity = credentials.flatMap((credential) => {
        const activities = [{
            id: `credential-issued-${credential._id}`,
            type: "Credential issued",
            detail: `A credential was issued to ${credential.studentName}.`,
            timestamp: credential.createdAt
        }];

        if (credential.status === "revoked" && credential.revokedAt) {
            activities.push({
                id: `credential-revoked-${credential._id}`,
                type: "Credential revoked",
                detail: `The credential for ${credential.studentName} was revoked.`,
                timestamp: credential.revokedAt
            });
        }

        return activities;
    });

    return [...studentActivity, ...credentialActivity]
        .filter((activity) => activity.timestamp)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
};


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
            credentials,
            studentActivity,
            credentialActivity
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
            }),

            User.find({
                College_Id: collegeId,
                role:"student"
            }).select("Name accountStatus createdAt updatedAt"),

            Credential.find({
                collegeId: collegeId
            }).select("studentName status createdAt revokedAt")

        ]);


        res.json({
            success:true,
            data:{
                students,
                pendingStudents,
                credentials,
                verificationRate:100,
                recentActivity: buildRecentActivity({
                    students: studentActivity,
                    credentials: credentialActivity
                })
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


        const [students, credentialCounts] = await Promise.all([
            User.find({
                College_Id:collegeId,
                role:"student",
                accountStatus:"approved"
            }).select("-Password").lean(),

            Credential.aggregate([
                { $match: { collegeId: new mongoose.Types.ObjectId(collegeId) } },
                { $group: { _id: "$studentId", count: { $sum: 1 } } }
            ])
        ]);

        const credentialsByStudentId = new Map(
            credentialCounts.map(({ _id, count }) => [_id.toString(), count])
        );

        const studentsWithCredentialCounts = students.map((student) => ({
            ...student,
            credentials: credentialsByStudentId.get(student._id.toString()) || 0
        }));


        res.json({
            success:true,
            data:studentsWithCredentialCounts
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

        const collegeId = req.user.collegeId;


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

        const collegeId = req.user.collegeId;


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

        const collegeId = req.user.collegeId;


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

        const collegeId = req.user.college_Id;


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

        const {currentPassword,newPassword}=req.body;


        const user = await User.findById(req.user.id)
            .select("+Password");


        const isMatch = await user.comparePassword(currentPassword);


        if(!isMatch){

            return res.status(400).json({

                success:false,
                message:"Current password is incorrect"

            });

        }


        user.Password = newPassword;

        await user.save();


        res.json({

            success:true,
            message:"Password updated successfully"

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};
exports.getAllColleges = async(req,res)=>{

    try{

        const colleges = await College.find({
            status:"verified"
        }).select("collegeName collegeCode");


        res.status(200).json({
            success:true,
            data:colleges
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
exports.approveStudent = async(req,res)=>{

    try{


        const student = await User.findById(req.params.id);


        if(!student){

            return res.status(404).json({

                success:false,
                message:"Student not found"

            });

        }



        student.accountStatus = "approved";


        await student.save();



        res.json({

            success:true,

            message:"Student approved successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};
exports.deleteStudent = async(req,res)=>{

    try{


        const student = await User.findById(req.params.id);



        if(!student){

            return res.status(404).json({

                success:false,

                message:"Student not found"

            });

        }



        await User.findByIdAndDelete(req.params.id);



        res.json({

            success:true,

            message:"Student deleted successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};
