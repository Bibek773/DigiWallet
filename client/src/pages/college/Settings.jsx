import { useState } from "react";
import "./Settings.css";
import "../../styles/PageHero.css";
import { updateSettings } from "../../services/collegeService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Settings(){

    const [formData,setFormData] = useState({
        currentPassword:"",
        newPassword:"",
        confirmPassword:""
    });

    const [message,setMessage] = useState("");
    const [error,setError] = useState("");
    const[showPassword,setShowPassword]=useState({
        current:false,
        new:false,
        confirm:false
    })

    const handleChange = (e)=>{

        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });

    };
    const togglePassword=(field)=>{
        setShowPassword({
            ...showPassword,
            [field]:!showPassword[field]
        })
    }

    const handleSubmit = async(e)=>{

        e.preventDefault();

        setMessage("");
        setError("");


        if(formData.newPassword !== formData.confirmPassword){

            setError("New passwords do not match");
            return;

        }


        try{

            await updateSettings({

                currentPassword:formData.currentPassword,
                newPassword:formData.newPassword

            });


            setMessage("Password updated successfully");


            setFormData({
                currentPassword:"",
                newPassword:"",
                confirmPassword:""
            });


        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Failed to update settings"
            );

        }

    };


    return(

        <div className="settings-page">

            <section className="page-hero">

                <div className="page-hero-overlay">

                    <p className="page-tag">
                        Account Settings
                    </p>


                    <h1>
                        Settings
                    </h1>


                    <p className="page-description">
                        Manage your college account security and preferences.
                    </p>


                </div>

            </section>



            <section className="settings-container">


                <div className="settings-card">

                    <h2>
                        Change Password
                    </h2>


                    <form onSubmit={handleSubmit}>

                    <div className="password-wrapper">

                        <input
                            type={showPassword.current ? "text" : "password"}
                            name="currentPassword"
                            placeholder="Current Password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                        />

                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => togglePassword("current")}
                        >
                            {
                                showPassword.current
                                ? <FaEye/>
                                : <FaEyeSlash />
                            }
                        </button>

                    </div>
                                            


                       <div className="password-wrapper">

                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePassword("new")}
                            >
                                {
                                    showPassword.new
                                    ? <FaEye />
                                    : <FaEyeSlash />
                                }
                            </button>

                        </div>


                        <div className="password-wrapper">

                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePassword("confirm")}
                            >
                                {
                                    showPassword.confirm
                                    ? <FaEye />
                                    : <FaEyeSlash />
                                }
                            </button>

                        </div>


                        <button className="update">
                            Update Password
                        </button>


                    </form>


                    {
                        message &&
                        <p className="success">
                            {message}
                        </p>
                    }


                    {
                        error &&
                        <p className="error">
                            {error}
                        </p>
                    }


                </div>


            </section>


        </div>

    );

}
