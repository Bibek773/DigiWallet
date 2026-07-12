import "./CollegeDashboard.css";

import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";

export default function CollegeDashboard(){

    return(

        <div className="dashboard">

            <Sidebar/>

            <main className="dashboard-content">

                <TopNavbar />

                {/* Hero Section */}

                <section className="dashboard-hero">

                    <div className="hero-overlay">

                        <p className="dashboard-tag">
                            College Management Portal
                        </p>

                        <h1>
                            Welcome to DigiWallet
                        </h1>

                        <p>
                            Manage students, verify academic records,
                            issue secure digital credentials,
                            and monitor all institutional activities
                            from one centralized dashboard.
                        </p>

                    </div>

                </section>


                {/* Dashboard Cards */}

                <section className="dashboard-cards">

                    <div className="card">

                        <h3>Students</h3>

                        <h2>256</h2>

                        <span>Registered Students</span>

                    </div>

                    <div className="card">

                        <h3>Pending Requests</h3>

                        <h2>18</h2>

                        <span>Awaiting Approval</span>

                    </div>

                    <div className="card">

                        <h3>Credentials</h3>

                        <h2>124</h2>

                        <span>Issued Successfully</span>

                    </div>

                    <div className="card">

                        <h3>Verification</h3>

                        <h2>98%</h2>

                        <span>Success Rate</span>

                    </div>

                </section>


                {/* Rest of dashboard */}

                <section className="dashboard-body">

                    <div className="content-box">

                        <h2>Recent Activity</h2>

                        <p>
                            Student approvals, credential issuance,
                            and verification logs will appear here.
                        </p>

                    </div>

                </section>

            </main>
        </div>

    );

}