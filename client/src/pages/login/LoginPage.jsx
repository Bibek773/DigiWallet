import { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {

    const [formData, setFormData] = useState({
        email:"",
        password:""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e)=>{

        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await loginUser(formData);
            const { user } = await login(response.data);

            if(user.role === "student"){

                navigate("/student/dashboard");

            }
            else if(user.role === "college"){

                navigate("/college/dashboard");

            }
            else if(user.role === "super_admin" || user.role === "admin"){

                navigate("/admin/dashboard");

            }
            else{

                navigate("/");

            }


        } catch(error){

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        }
        finally{
            setLoading(false);
        }

    };
    


    return (

        <div className="login-page">


            <div className="login-box">


                <div className="logo-area">

                    <h1>
                        DiGiWallet
                    </h1>

                    <p>
                        Digital Credential Management System
                    </p>

                </div>



                <form onSubmit={handleSubmit}>


                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                                        




                    <div className="login-options">

                        <label>
                            <input type="checkbox"/>
                            Remember me
                        </label>


                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot password?
                        </Link>

                    </div>





                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && (

                        <p className="error-message">
                            {error}
                        </p>
                    )}


                </form>



                <div className="register-link">

                    Don't have an account?
                    <Link to="/register">Register</Link>

                </div>


            </div>


        </div>

    );

}
