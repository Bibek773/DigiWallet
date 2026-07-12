import "./Profile.css";
import "../../styles/PageHero.css"
import TopNavbar from "../../components/TopNavbar";


export default function Profile(){

    return(

        <div className="profile-page">


            <TopNavbar/>


            {/* Header */}

            <section className="page-hero">


                <div className="page-hero-overlay">

                    <p className="page-tag">
                        Institution Profile
                    </p>


                    <h1>
                        College Profile
                    </h1>


                    <p className="page-description">

                        View and manage your institution
                        information and security details.

                    </p>


                </div>


            </section>



            {/* Profile Content */}


            <section className="profile-container">


                {/* College Information */}

                <div className="profile-card">


                    <h2>
                        College Information
                    </h2>


                    <div className="profile-grid">


                        <div className="profile-item">

                            <label>
                                College Name
                            </label>

                            <p>
                                ABC College
                            </p>

                        </div>



                        <div className="profile-item">

                            <label>
                                College Code
                            </label>

                            <p>
                                ABC001
                            </p>

                        </div>



                        <div className="profile-item">

                            <label>
                                Email
                            </label>

                            <p>
                                info@abccollege.edu
                            </p>

                        </div>



                        <div className="profile-item">

                            <label>
                                Phone Number
                            </label>

                            <p>
                                +977 9800000000
                            </p>

                        </div>



                        <div className="profile-item">

                            <label>
                                Website
                            </label>

                            <p>
                                www.abccollege.edu
                            </p>

                        </div>



                        <div className="profile-item">

                            <label>
                                Established Year
                            </label>

                            <p>
                                2005
                            </p>

                        </div>


                    </div>


                </div>




                {/* Security Section */}


                <div className="profile-card">


                    <h2>
                        Security Information
                    </h2>



                    <div className="security-box">


                        <div>

                            <label>
                                Verification Status
                            </label>


                            <span className="status verified">

                                Verified

                            </span>


                        </div>



                        <div>

                            <label>
                                Key ID
                            </label>


                            <p>
                                ABC001_v1
                            </p>


                        </div>



                        <div>

                            <label>
                                Algorithm
                            </label>


                            <p>
                                RSA 2048

                            </p>


                        </div>



                    </div>


                </div>



            </section>



        </div>

    );

}