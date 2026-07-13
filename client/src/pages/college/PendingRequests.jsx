import "./PendingRequests.css";

import TopNavbar from "../../components/TopNavbar";
import "../../styles/PageHero.css"

export default function PendingRequests(){

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


                        <tr>


                            <td>
                                John Doe
                            </td>


                            <td>
                                Credential Issue
                            </td>


                            <td>
                                BCA Transcript
                            </td>


                            <td>
                                2026-07-10
                            </td>


                            <td>

                                <span className="status pending">

                                    Pending

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



                        <tr>


                            <td>
                                Jane Smith
                            </td>


                            <td>
                                Student Approval
                            </td>


                            <td>
                                BBA Enrollment
                            </td>


                            <td>
                                2026-07-11
                            </td>


                            <td>

                                <span className="status pending">

                                    Pending

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


                    </tbody>


                </table>


            </section>



        </div>

    );

}