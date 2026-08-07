import { useState } from "react";
import { approveStudent,deleteStudent } from "../services/collegeService";
import "./StudentTable.css";

import {
    FaEye,
    FaCheck,
    FaTrash
} from "react-icons/fa";


export default function StudentTable({
    students,
    setSelectedStudent,
    fetchStudents
}) {

    const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    studentId: null,
    });
    const handleApprove = async(student) => {

       try {
        await approveStudent( student._id);
        alert("Student approved");
        fetchStudents();
       } catch (error) {
        console.log(error);
       } 
        // later connect API:
        // approveStudent(student._id)

    };

    const handleDelete = (student) => {
        setConfirmDialog({
            open: true,
            studentId: student._id,
        });
    };

   const confirmDeleteStudent = async () => {
    try {
        await deleteStudent(confirmDialog.studentId);

        fetchStudents();

        setConfirmDialog({
            open: false,
            studentId: null,
        });

    } catch (error) {
        console.log(error);
    }
    };



    return (
        <>
        <div className="students-table-container">


            <table>


                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Registration No.</th>

                        <th>Program</th>

                        <th>Email</th>

                        <th>Credentials</th>

                        <th>Status</th>

                        <th>Action</th>


                    </tr>


                </thead>



                <tbody>


                {

                    students && students.length > 0 ?


                    (

                    students.map((student)=>(


                        <tr key={student._id}>


                            <td>

                                {student.Name}

                            </td>



                            <td>

                                {student.RegistrationNumber}

                            </td>



                            <td>

                                {student.Faculty}

                            </td>



                            <td>

                                {student.email || student.Email}

                            </td>



                            <td>

                                {student.credentials || 0}

                            </td>




                            <td>


                                <span

                                className={

                                    student.accountStatus === "approved"

                                    ?

                                    "status verified"

                                    :

                                    "status pending"

                                }

                                >

                                    {student.accountStatus}


                                </span>


                            </td>





                            <td>


                                <div className="action-icons">



                                    {/* View */}

                                    <button

                                    className="icon-btn view"

                                    title="View student details"

                                    onClick={() =>
                                        setSelectedStudent(student)
                                    }

                                    >

                                        <FaEye />

                                    </button>





                                    {/* Approve */}

                                    {

                                    student.accountStatus === "pending"

                                    &&

                                    (

                                        <button

                                        className="icon-btn approve"

                                        title="Approve student"

                                        onClick={() =>
                                            handleApprove(student)
                                        }

                                        >

                                            <FaCheck />

                                        </button>


                                    )

                                    }





                                    {/* Delete */}

                                    <button

                                    className="icon-btn delete"

                                    title="Delete student"

                                    onClick={() =>
                                        handleDelete(student)
                                    }

                                    >

                                        <FaTrash />

                                    </button>



                                </div>



                            </td>




                        </tr>


                    ))

                    )

                    :


                    (

                        <tr>

                            <td colSpan="7">

                                No students found

                            </td>

                        </tr>

                    )


                }


                </tbody>


            </table>
        </div>
        {confirmDialog.open && (
            <div className="student-modal">
                <div className=" confirmation-modal">

                    <h2>Delete Student</h2>

                    <p>
                        Are you sure you want to delete this student?
                    </p>

                    <div className="confirmation-buttons">

                        <button
                            className="cancel-btn"
                            onClick={() =>
                                setConfirmDialog({
                                    open: false,
                                    studentId: null,
                                })
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className="delete-btn"
                            onClick={confirmDeleteStudent}
                        >
                            Delete
                        </button>

                    </div>

                </div>
            </div>
        )}
     
</>
    );

}