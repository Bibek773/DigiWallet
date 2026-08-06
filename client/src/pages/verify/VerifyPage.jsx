import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../../services/api";
import VerifyResult from "./VerifyResult";
import "./VerifyPage.css";

export default function VerifyPage() {
  const { credentialId } = useParams();
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const verifyCredential = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/verify/${credentialId}${search}`);
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
  }, [credentialId, search]);

  return (
    <main className="verify-page">
      <section className="verify-panel">
        <Link to="/" className="verify-brand">
          DiGiWallet
        </Link>
        <VerifyResult loading={loading} verification={verification} error={error} />
      </section>
    </main>
  );
}
