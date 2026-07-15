import "./PendingRequests.css";

import { useEffect, useState } from "react";

import TopNavbar from "../../components/TopNavbar";
import "../../styles/PageHero.css";

import { getPendingRequests } from "../../services/collegeService";


export default function PendingRequests(){

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(()=>{

        const fetchRequests = async()=>{

            try{

                const response = await getPendingRequests();

                setRequests(response.data.data);

            }
            catch(error){

                console.log("Error fetching pending requests:", error);

            }
            finally{

                setLoading(false);

            }

        };


        fetchRequests();


    },[]);



    if(loading){

        return <h2>Loading requests...</h2>;

    }



    return(


        <div className="pending-page">


            <TopNavbar/>



            {/* Header */}

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





            {/* Requests Table */}


            <section className="pending-table-container">


                <table>


                    <thead>

                        <tr>

                            <th>Requester</th>

                            <th>Request Type</th>

                            <th>Details</th>

                            <th>Date</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>




                    <tbody>



                    {
                        requests?.map((request)=>(


                            <tr key={request._id}>


                                <td>

                                    {request.Name}

                                </td>



                                <td>

                                    Student Approval

                                </td>



                                <td>

                                    {request.Faculty}

                                </td>



                                <td>

                                    {
                                    new Date(
                                        request.createdAt
                                    ).toLocaleDateString()
                                    }

                                </td>



                                <td>


                                    <span className="status pending">

                                        {request.accountStatus}

                                    </span>


                                </td>




                                <td>


                                    <div className="action-buttons">


                                        <button className="approve-btn">

                                            Approve

                                        </button>



                                        <button className="reject-btn">

                                            Reject

                                        </button>


                                    </div>


                                </td>



                            </tr>


                        ))
                    }



                    </tbody>


                </table>


            </section>



        </div>


    );

}