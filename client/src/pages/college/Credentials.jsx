import "./Credentials.css";

import TopNavbar from "../../components/TopNavbar";
import "../../styles/PageHero.css"

export default function Credentials(){

    return(

        <div className="credentials-page">

            <TopNavbar/>


            {/* Header */}

            <section className="page-hero">

                <div className="page-hero-overlay">

                    <p className="page-tag">
                        Credential Management
                    </p>


                    <h1>
                        Digital Credentials
                    </h1>


                    <p className="page-description">

                        Issue, manage and monitor verified
                        academic credentials of your students.

                    </p>

                </div>

            </section>



            {/* Credential Table */}

            <section className="credentials-table-container">


                <table>


                    <thead>

                        <tr>

                            <th>Student Name</th>

                            <th>Credential ID</th>

                            <th>Degree</th>

                            <th>Issued Date</th>

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
                                DIGI-2025-001
                            </td>


                            <td>
                                Bachelor in Computer Application
                            </td>


                            <td>
                                2025-06-20
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
                                Jane Smith
                            </td>


                            <td>
                                DIGI-2025-002
                            </td>


                            <td>
                                Bachelor of Business Administration
                            </td>


                            <td>
                                2025-06-25
                            </td>


                            <td>

                                <span className="status pending">

                                    Pending

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