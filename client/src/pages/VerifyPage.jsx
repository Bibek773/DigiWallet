import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";
import api from "../services/api";
import "./VerifyPage.css";

const resultLabels = {
  valid: "Valid credential",
  revoked: "Revoked credential",
  tampered: "Tampered credential",
  invalid_signature: "Invalid signature",
  not_found: "Credential not found",
};

const credentialFieldLabels = {
  studentName: "Student name",
  examRoll: "Exam roll",
  registrationNumber: "Registration no.",
  semester: "Semester",
  level: "Level",
  faculty: "Faculty",
  program: "Program",
  batch: "Batch",
  collegeName: "College",
  CGPA: "CGPA",
  academicYear: "Academic year",
  grade: "Grade",
  credentialType: "Credential type",
  issuedAt: "Issued at",
};

const credentialFieldOrder = Object.keys(credentialFieldLabels);

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "number") return String(value);

  const parsedDate = typeof value === "string" ? new Date(value) : null;
  if (parsedDate && !Number.isNaN(parsedDate.getTime()) && value.includes("T")) {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(parsedDate);
  }

  return String(value);
};

const getCredentialDetails = (credential) => {
  const data = credential?.credentialData || credential || {};
  const orderedFields = credentialFieldOrder
    .filter((key) => Object.prototype.hasOwnProperty.call(data, key))
    .map((key) => [credentialFieldLabels[key], data[key]]);

  const remainingFields = Object.entries(data)
    .filter(([key]) => !credentialFieldOrder.includes(key))
    .map(([key, value]) => [
      key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()),
      value,
    ]);

  return [...orderedFields, ...remainingFields];
};

export default function VerifyPage() {
  const { credentialId } = useParams();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const verifyCredential = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/verify/${credentialId}`);
        if (!ignore) setVerification(response.data);
      } catch (requestError) {
        if (!ignore) {
          setError(
            requestError.response?.data?.message ||
              "Unable to verify this credential."
          );
          setVerification(requestError.response?.data || null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    verifyCredential();

    return () => {
      ignore = true;
    };
  }, [credentialId]);

  const result = verification?.result || (error ? "not_found" : "");
  const isValid = verification?.valid;
  const credential = verification?.credential;
  const credentialDetails = getCredentialDetails(credential);

  return (
    <main className="verify-page">
      <section className="verify-panel">
        <Link to="/" className="verify-brand">
          DiGiWallet
        </Link>

        {loading ? (
          <div className="verify-state">
            <FaShieldAlt aria-hidden="true" />
            <h1>Verifying credential</h1>
            <p>Checking the credential signature, hash, and status.</p>
          </div>
        ) : (
          <>
            <div className={`verify-result verify-result--${isValid ? "valid" : "warning"}`}>
              {isValid ? (
                <FaCheckCircle aria-hidden="true" />
              ) : (
                <FaExclamationTriangle aria-hidden="true" />
              )}
              <div>
                <span>{resultLabels[result] || "Verification result"}</span>
                <h1>{verification?.message || error}</h1>
              </div>
            </div>

            {credential && (
              <>
                <section className="verify-section">
                  <h2>Credential information</h2>
                  <dl className="verify-details">
                    {credentialDetails.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{formatValue(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="verify-section">
                  <h2>Verification proof</h2>
                  <dl className="verify-details verify-details--proof">
                    <div>
                      <dt>Issuer</dt>
                      <dd>{credential.issuerCollege || credential.collegeName || "N/A"}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{credential.status || verification?.checks?.status || "N/A"}</dd>
                    </div>
                  
                    
                  </dl>
                </section>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}
