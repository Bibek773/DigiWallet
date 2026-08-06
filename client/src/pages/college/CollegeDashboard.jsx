import "./CollegeDashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCollegeDashboard } from "../../services/collegeService";

const formatVerifiedAt = (timestamp) =>
    timestamp
        ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp))
        : "—";

const statusClass = (status) => (status === "valid" ? "valid" : status === "revoked" ? "revoked" : "warning");

export default function CollegeDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const recentActivity = dashboardData?.recentActivity || [];
    const recentVerifications = dashboardData?.recentVerifications || [];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getCollegeDashboard();
                setDashboardData(response.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            <section className="dashboard-hero"><div className="hero-overlay">
                <p className="dashboard-tag">College Management Portal</p>
                <h1>Welcome to DigiWallet</h1>
                <p>Manage students, verify academic records, issue secure digital credentials, and monitor all institutional activities from one centralized dashboard.</p>
            </div></section>

            <section className="dashboard-cards">
                <div className="card"><h3>Students</h3><h2>{dashboardData?.students || 0}</h2><span>Registered Students</span></div>
                <div className="card"><h3>Pending Requests</h3><h2>{dashboardData?.pendingStudents || 0}</h2><span>Awaiting Approval</span></div>
                <div className="card"><h3>Credentials</h3><h2>{dashboardData?.credentials || 0}</h2><span>Issued Successfully</span></div>
                <div className="card"><h3>Verification</h3><h2>{dashboardData?.verificationRate || 0}%</h2><span>Success Rate</span></div>
            </section>

            <section className="dashboard-body">
                <div className="content-box verification-activity-box">
                    <div className="dashboard-section-heading">
                        <div><p>Latest five</p><h2>Recent Verification Activity</h2></div>
                        <button type="button" className="verification-view-all" onClick={() => navigate("/college/verification-logs")}>View All Verification Logs</button>
                    </div>
                    {recentVerifications.length ? <div className="dashboard-table-wrap"><table className="dashboard-verification-table"><thead><tr><th>Student Name</th><th>Registration Number</th><th>Credential Type</th><th>Verification Method</th><th>Verification Status</th><th>Verified Date & Time</th></tr></thead><tbody>
                        {recentVerifications.map((log) => <tr key={log._id}><td>{log.studentName || "—"}</td><td>{log.registrationNumber || "—"}</td><td>{log.credentialType || "—"}</td><td>{log.verificationMethod || "—"}</td><td><span className={`dashboard-verification-status ${statusClass(log.verificationStatus)}`}>{log.verificationStatus?.replace("_", " ") || "—"}</span></td><td>{formatVerifiedAt(log.verifiedAt)}</td></tr>)}
                    </tbody></table></div> : <div className="verification-empty-state"><strong>No verification activity yet</strong><span>Verification events for credentials issued by your college will appear here.</span></div>}
                </div>

                <div className="content-box college-recent-activity"><h2>Recent Activity</h2>
                    {recentActivity.length ? recentActivity.map((activity) => <p key={activity.id}><strong>{activity.type}:</strong> {activity.detail} · {new Date(activity.timestamp).toLocaleString()}</p>) : <p>No recent activity yet.</p>}
                </div>
            </section>
        </>
    );
}
