import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";
import {
    FaHome,
    FaUserGraduate,
    FaFileAlt,
    FaCheckCircle,
    FaUniversity,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";


export default function Sidebar({ className = "", onNavigate }) {
    const navigate=useNavigate();//import hook
    const {logout}=useAuth();
    const handleLogout=()=>{ 
        // logout handler which removes token, user from localStorage and clears session state
        logout();
        navigate("/login")
    }
    return (
        <aside id="college-sidebar" className={`sidebar ${className}`.trim()}>

            <Link to="/" className="sidebar-logo" aria-label="Go to home page">

                <h2>DiGiWallet</h2>

                <p>College Portal</p>

            </Link>

            <nav onClick={onNavigate}>

                <Link to="/college/dashboard">
                    <FaHome />
                    Dashboard
                </Link>

                
                    
                    <Link to="/college/students">
                     <FaUserGraduate />
                        Students
                    </Link>
                

                
                    
                    <Link to="/college/credentials">
                       <FaFileAlt />
                        Credentials
                    </Link>
                   
               
                    
                    <Link to="/college/pending-requests">
                     <FaFileAlt />
                        Pending Requests
                    </Link>
                

                    
                    <Link to="/college/verification">
                     <FaCheckCircle />
                        Verification
                    </Link>
                

                
                    
                    <Link to="/college/profile">
                      <FaUniversity />
                        College Profile
                    </Link>
                
                    

                <Link to="/college/settings">
                    <FaCog />
                    Settings
                </Link>

            </nav>

            <button className="logout-btn" onClick={handleLogout}>

                <FaSignOutAlt />

                Logout

            </button>

        </aside>
    );
}
