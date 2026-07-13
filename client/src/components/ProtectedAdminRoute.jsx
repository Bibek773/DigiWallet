import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProtectedAdminRoute.css";

export default function ProtectedAdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main className="admin-guard">
                <section className="admin-guard__panel">
                    <span className="admin-guard__spinner" aria-hidden="true" />
                    <h1>Checking access</h1>
                    <p>Validating your DigiWallet session.</p>
                </section>
            </main>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return (
            <main className="admin-guard">
                <section className="admin-guard__panel">
                    <span className="admin-guard__code">403</span>
                    <h1>Admin access required</h1>
                    <p>
                        {user?.email || "This account"} is signed in, but does not have permission
                        to manage the DigiWallet platform.
                    </p>
                    <div className="admin-guard__actions">
                        <Link to="/" className="admin-guard__button">
                            Go home
                        </Link>
                        <Link to="/login" className="admin-guard__link">
                            Sign in with another account
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    return children;
}
