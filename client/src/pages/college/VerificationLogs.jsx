import "./VerificationLogs.css";
import "../../styles/PageHero.css";
import { useEffect, useState } from "react";
import { getVerificationLogs } from "../../services/collegeService";

const formatVerifiedAt = (timestamp) => timestamp && !Number.isNaN(new Date(timestamp).getTime())
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp)) : "—";
const getStatusClass = (status) => status === "valid" ? "valid" : status === "revoked" ? "revoked" : "warning";

export default function VerificationLogs() {
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVerificationLogs = async () => {
            try {
                const response = await getVerificationLogs();
                const data = response.data.data || {};
                setLogs(data.logs || response.data.logs || []);
                setSummary(data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load verification logs.");
            } finally { setLoading(false); }
        };
        fetchVerificationLogs();
    }, []);

    const cards = [["Total Verifications", "totalVerifications", "All credential checks"], ["Valid", "validVerifications", "Verified successfully"], ["Revoked", "revokedVerifications", "Revoked credentials checked"], ["Tampered / Invalid", "tamperedVerifications", "Tampered or invalid signatures"]];
    return <div className="verification-logs-page">
        <section className="page-hero"><div className="page-hero-overlay"><p className="page-tag">Verification History</p><h1>Verification Logs</h1><p className="page-description">Review every credential verification performed for credentials issued by your college.</p></div></section>
        <section className="verification-log-summary" aria-label="Verification summary">
            {cards.map(([label, key, detail]) => <article key={key}><span>{label}</span><strong>{summary[key] || 0}</strong><small>{detail}</small></article>)}
        </section>
        <section className="verification-logs-table-container">
            {loading && <p className="verification-logs-message">Loading verification logs...</p>}
            {!loading && error && <p className="verification-logs-message verification-logs-error">{error}</p>}
            {!loading && !error && logs.length === 0 && <div className="verification-empty-state"><strong>No verification logs yet</strong><span>Credential verification activity for your college will appear here.</span></div>}
            {!loading && !error && logs.length > 0 && <table><thead><tr><th>Student Name</th><th>Registration Number</th><th>Roll Number</th><th>Credential Type</th><th>Verification Method</th><th>Verification Status</th><th>Verified Date & Time</th><th>College Name</th></tr></thead><tbody>
                {logs.map((log) => <tr key={log._id}><td>{log.studentName || "—"}</td><td>{log.registrationNumber || "—"}</td><td>{log.rollNumber || "—"}</td><td>{log.credentialType || "—"}</td><td>{log.verificationMethod || "—"}</td><td><span className={`verification-status ${getStatusClass(log.verificationStatus)}`}>{log.verificationStatus?.replace("_", " ") || "—"}</span></td><td>{formatVerifiedAt(log.verifiedAt)}</td><td>{log.collegeName || "—"}</td></tr>)}
            </tbody></table>}
        </section>
    </div>;
}
