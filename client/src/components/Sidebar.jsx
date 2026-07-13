import { Link } from "react-router-dom";
import "./Sidebar.css";
import {
    FaHome,
    FaUserGraduate,
    FaFileAlt,
    FaCheckCircle,
    FaUniversity,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">

                <h2>DiGiWallet</h2>

                <p>College Portal</p>

            </div>

            <nav>

                <a href="#">
                    <FaHome />
                    Dashboard
                </a>

                <a href="#">
                    <FaUserGraduate />
                    <Link to="/college/students">
                        Students
                    </Link>
                </a>

                <a href="#">
                    <FaFileAlt />
                    <Link to="/college/credentials">
                        Credentials
                    </Link>
                </a>    
                    
                <a href="#">
                    <FaFileAlt />
                    <Link to="/college/pending-requests">
                        Pending Requests
                    </Link>
                </a>

                <a href="#">
                    <FaCheckCircle />
                    <Link to="/college/verification">
                        Verification
                    </Link>
                </a>

                <a href="#">
                    <FaUniversity />
                    <Link to="/college/profile">
                        College Profile
                    </Link>
                </a>
                    

                <a href="#">
                    <FaCog />
                    Settings
                </a>

            </nav>

            <button className="logout-btn">

                <FaSignOutAlt />

                Logout

            </button>

        </aside>
    );
}