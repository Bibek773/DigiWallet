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
              <dl className="verify-details">
                <div>
                  <dt>Student</dt>
                  <dd>{credential.studentName}</dd>
                </div>
                <div>
                  <dt>Registration No.</dt>
                  <dd>{credential.registrationNumber}</dd>
                </div>
                <div>
                  <dt>Issuer</dt>
                  <dd>{credential.issuerCollege || "N/A"}</dd>
                </div>
                <div>
                  <dt>Algorithm</dt>
                  <dd>{credential.signatureAlgorithm}</dd>
                </div>
                <div>
                  <dt>Key ID</dt>
                  <dd>{credential.keyId || "N/A"}</dd>
                </div>
              </dl>
            )}
          </>
        )}
      </section>
    </main>
  );
}
