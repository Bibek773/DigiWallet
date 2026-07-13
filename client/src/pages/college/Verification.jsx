import "./Verification.css";

import TopNavbar from "../../components/TopNavbar";
import "../../styles/PageHero.css"

export default function Verification(){

    return(

        <div className="verification-page">


            <TopNavbar/>


            {/* Header */}

            <section className="page-hero">


                <div className="page-hero-overlay">

                    <p className="page-tag">
                        Credential Verification
                    </p>


                    <h1>
                        Verification Requests
                    </h1>


                    <p className="page-description">

                        Monitor credential verification requests
                        and ensure authenticity of academic records.

                    </p>


                </div>


            </section>




            {/* Verification Table */}


            <section className="verification-table-container">


                <table>


                    <thead>


                        <tr>

                            <th>Requester</th>

                            <th>Credential ID</th>

                            <th>Student</th>

                            <th>Date</th>

                            <th>Status</th>

                            <th>Action</th>


                        </tr>


                    </thead>



                    <tbody>


                        <tr>


                            <td>
                                ABC Company
                            </td>


                            <td>
                                DIGI-2025-001
                            </td>


                            <td>
                                John Doe
                            </td>


                            <td>
                                2026-07-10
                            </td>


                            <td>

                                <span className="status verified">

                                    Verified

                                </span>

                            </td>


                            <td>

                                <button className="view-btn">

                                    View

                                </button>

                            </td>


                        </tr>



                        <tr>


                            <td>
                                XYZ University
                            </td>


                            <td>
                                DIGI-2025-002
                            </td>


                            <td>
                                Jane Smith
                            </td>


                            <td>
                                2026-07-11
                            </td>


                            <td>

                                <span className="status rejected">

                                    Invalid

                                </span>

                            </td>


                            <td>

                                <button className="view-btn">

                                    View

                                </button>

                            </td>


                        </tr>


                    </tbody>


                </table>


            </section>



        </div>

    );

}