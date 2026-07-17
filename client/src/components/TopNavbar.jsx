import { Link } from "react-router-dom";
import "./TopNavbar.css";

export default function TopNavbar({ onProfileClick, isSidebarOpen = false }) {

    const college = JSON.parse(localStorage.getItem("user"));

    return (

        <header className="top-navbar">

            <div>

                <h2>Dashboard</h2>

                <p>
                    Welcome back,
                    <strong> {college?.name}</strong>
                    {/* this is supposed to show the college name, since superadmin is not ready yet, it's a placeholder */}
                </p>

            </div>

            {onProfileClick ? (
            <button
                type="button"
                className={`profile profile-toggle ${isSidebarOpen ? "profile--sidebar-open" : ""}`}
                onClick={onProfileClick}
                aria-label={isSidebarOpen ? "Close sidebar navigation" : "Open sidebar navigation"}
                aria-expanded={isSidebarOpen}
                aria-controls="college-sidebar"
            >
                {/* later it can be replaced with actual college logo */}

                <div className="profile-circle">

                    {college?.name?.charAt(0)}
{/* gives first letter of the college name */}
                </div>

            </button>
            ) : (
            <Link to="/college/dashboard" className="profile">
                <div className="profile-circle">
                    {college?.name?.charAt(0)}
                </div>
            </Link>
            )}

        </header>

    );
}
