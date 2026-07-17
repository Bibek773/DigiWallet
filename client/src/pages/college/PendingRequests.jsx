import "./PendingRequests.css";

import { useEffect, useState } from "react";

import "../../styles/PageHero.css";

import { 
    getPendingRequests,
    approveStudent,
    deleteStudent
} from "../../services/collegeService";

import {
    FaEye,
    FaCheck,
    FaTimes
} from "react-icons/fa";


export default function PendingRequests(){

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchRequests = async()=>{

        try{

            const response = await getPendingRequests();

            setRequests(response.data.data);

        }
        catch(error){

            console.log(
                "Error fetching pending requests:",
                error
            );

        }
        finally{

            setLoading(false);

        }

    };



    useEffect(()=>{

        fetchRequests();

    },[]);




    const handleApprove = async(id)=>{

        try{

            await approveStudent(id);

            fetchRequests();

        }
        catch(error){

            console.log(error);

        }

    };



    const handleReject = async(id)=>{

        try{

            await deleteStudent(id);

            fetchRequests();

        }
        catch(error){

            console.log(error);

        }

    };





    if(loading){

        return <h2>Loading requests...</h2>;

    }




    return(

        <div className="pending-page">


            <section className="page-hero">


                <div className="page-hero-overlay">


                    <p className="page-tag">
                        Request Management
                    </p>



                    <h1>
                        Pending Requests
                    </h1>



                    <p className="page-description">

                        Review and manage pending student,
                        credential and approval requests.

                    </p>


                </div>


            </section>






            <section className="pending-table-container">


                <table>


                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Request Type</th>

                            <th>Faculty</th>

                            <th>Date</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>



                    <tbody>


                    {
                        requests.length > 0 ?

                        requests.map((request)=>(


                            <tr key={request._id}>


                                <td data-label="Name">

                                    {request.Name}

                                </td>



                                <td data-label="Request">

                                    Student Approval

                                </td>



                                <td data-label="Faculty">

                                    {request.Faculty}

                                </td>




                                <td data-label="Date">

                                    {
                                        new Date(
                                            request.createdAt
                                        )
                                        .toLocaleDateString()
                                    }

                                </td>




                                <td data-label="Status">


                                    <span className="status pending">

                                        {request.accountStatus}

                                    </span>


                                </td>





                                <td data-label="Action">


                                    <div className="icon-actions">


                                        <button
                                        className="icon-btn view"
                                        title="View Student Details"
                                        onClick={()=>{
                                            
                                            setSelectedStudent(request)}}
                                        >

                                            <FaEye/>

                                        </button>





                                        <button
                                        className="icon-btn approve"
                                        title="Approve Student"
                                        onClick={()=>handleApprove(request._id)}
                                        >

                                            <FaCheck/>

                                        </button>





                                        <button
                                        className="icon-btn reject"
                                        title="Reject Student"
                                        onClick={()=>handleReject(request._id)}
                                        >

                                            <FaTimes/>

                                        </button>


                                    </div>


                                </td>



                            </tr>


                        ))

                        :

                        <tr>

                            <td colSpan="6">

                                No pending requests

                            </td>

                        </tr>

                    }


                    </tbody>



                </table>


            </section>

        {
            selectedStudent && (

            <div className="student-modal-overlay">


                <div className="student-modal">


                    <button
                    className="close-modal"
                    onClick={()=>setSelectedStudent(null)}
                    >
                        ×
                    </button>



                    <h2>
                        Student Details
                    </h2>



                    <div className="student-info">


                        <p>
                            <strong>Name:</strong>
                            {selectedStudent.Name}
                        </p>


                        <p>
                            <strong>Email:</strong>
                            {selectedStudent.Email}
                        </p>



                        <p>
                            <strong>Faculty:</strong>
                            {selectedStudent.Faculty}
                        </p>



                        <p>
                            <strong>Registration No:</strong>
                            {selectedStudent.RegistrationNumber}
                        </p>



                        <p>
                            <strong>Roll No:</strong>
                            {selectedStudent.RollNo}
                        </p>



                        <p>
                            <strong>Date of Birth:</strong>
                            {
                                new Date(
                                selectedStudent.DOB
                                ).toLocaleDateString()
                            }
                        </p>



                        <p>
                            <strong>Status:</strong>

                            <span className="status pending">
                                {selectedStudent.accountStatus}
                            </span>

                        </p>



                    </div>


                </div>


            </div>

            )
            }

        </div>

    );

}
