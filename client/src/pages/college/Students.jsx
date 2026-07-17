import "./Students.css";

import StudentTable from "../../components/StudentTable";
import "../../styles/PageHero.css";

import { useEffect, useState } from "react";
import { getStudents } from "../../services/collegeService";


export default function Students(){

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedStudent, setSelectedStudent] = useState(null);


    const fetchStudents = async()=>{

            try{

                const response = await getStudents();

                setStudents(response.data.data);

            }
            catch(error){

                console.log(error);

            }
            finally{

                setLoading(false);

            }

        };


    useEffect(()=>{

        
        fetchStudents();


    },[]);



    if(loading){

        return <h2>Loading students...</h2>;

    }



    return(

        <div className="students-page">


            <section className="page-hero">


                <div className="page-hero-overlay">


                    <p className="page-tag">
                        Student Management
                    </p>


                    <h1>
                        Students
                    </h1>


                    <p className="page-description">

                        Manage students and their digital credentials.

                    </p>


                </div>


            </section>



            <section className="students-table-section">


                <StudentTable
                    students={students}
                    setSelectedStudent={setSelectedStudent}
                    fetchStudents={fetchStudents}
                />


            </section>





            {
                selectedStudent && (

                    <div className="student-modal">


                        <div className="modal-content">


                            <h2>
                                Student Details
                            </h2>


                            <div className="student-details">


                                <p>
                                    <strong>Name:</strong>
                                    {" "}
                                    {selectedStudent.Name}
                                </p>


                                <p>
                                    <strong>Email:</strong>
                                    {" "}
                                    {selectedStudent.email || selectedStudent.Email}
                                </p>


                                <p>
                                    <strong>Faculty:</strong>
                                    {" "}
                                    {selectedStudent.Faculty}
                                </p>


                                <p>
                                    <strong>Registration No:</strong>
                                    {" "}
                                    {selectedStudent.RegistrationNumber}
                                </p>


                                <p>
                                    <strong>Roll No:</strong>
                                    {" "}
                                    {selectedStudent.RollNo}
                                </p>


                                <p>
                                    <strong>Date of Birth:</strong>
                                    {" "}
                                    {new Date(selectedStudent.DOB).toLocaleDateString()}
                                </p>


                                <p>
                                    <strong>Status:</strong>
                                    {" "}
                                    {selectedStudent.accountStatus}
                                </p>


                            </div>



                            <button
                                className="close-btn"
                                onClick={()=>setSelectedStudent(null)}
                            >

                                Close

                            </button>


                        </div>


                    </div>

                )
            }



        </div>

    );

}
