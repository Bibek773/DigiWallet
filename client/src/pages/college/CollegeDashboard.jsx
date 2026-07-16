import "./CollegeDashboard.css";

import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import { useEffect, useState } from "react";
import { getCollegeDashboard } from "../../services/collegeService";

export default function CollegeDashboard(){
    const[dashboardData,setDashboardData]=useState(null);
    const[loading,setLoading]=useState(true);
     useEffect(()=>{

        const fetchDashboard = async()=>{

            try{

                const response = await getCollegeDashboard();

                setDashboardData(response.data.data);

            }
            catch(error){

                console.log(error);

            }
            finally{

                setLoading(false);

            }

        };


        fetchDashboard();

    },[]);



    if(loading){

        return <h2>Loading...</h2>;

    }
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

                        <h2>{
                        dashboardData?.students||0
                        }
                        </h2>

                        <span>Registered Students</span>

                    </div>

                    <div className="card">

                        <h3>Pending Requests</h3>

                        <h2>{dashboardData?.pendingStudents||0
                            }
                        </h2>

                        <span>Awaiting Approval</span>

                    </div>

                    <div className="card">

                        <h3>Credentials</h3>

                        <h2>{dashboardData?.credentials||0}

                        </h2>

                        <span>Issued Successfully</span>

                    </div>

                    <div className="card">

                        <h3>Verification</h3>

                        <h2>{dashboardData?.verificationRate||0}%

                        </h2>

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