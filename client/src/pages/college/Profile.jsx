import "./Profile.css";
import "../../styles/PageHero.css";

import { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar";

import { getCollegeProfile } from "../../services/collegeService";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await getCollegeProfile();
                setProfile(response.data.data);

            } catch (error) {

                console.log("Error fetching college profile:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);

    if (loading) {
        return (
            <>
                <TopNavbar />
                <div className="profile-loading">
                    Loading College Profile...
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <TopNavbar />
                <div className="profile-loading">
                    Unable to load profile.
                </div>
            </>
        );
    }

    return (

        <div className="profile-page">

            <TopNavbar />

            <section className="page-hero">

                <div className="page-hero-overlay">

                    <p className="page-tag">
                        Institution Profile
                    </p>

                    <h1>
                        College Profile
                    </h1>

                    <p className="page-description">
                        View and manage your institution information and security details.
                    </p>

                </div>

            </section>

            <section className="profile-container">

                {/* College Information */}

                <div className="profile-card">

                    <h2>College Information</h2>

                    <div className="profile-grid">

                        <div className="profile-item">
                            <label>College Name</label>
                            <p>{profile.collegeName || "-"}</p>
                        </div>

                        <div className="profile-item">
                            <label>College Code</label>
                            <p>{profile.collegeCode || "-"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Email</label>
                            <p>{profile.email || "-"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Phone Number</label>
                            <p>{profile.phoneNumber || "-"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Website</label>

                            <p>
                                {profile.website ? (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {profile.website}
                                    </a>
                                ) : (
                                    "-"
                                )}
                            </p>

                        </div>

                        <div className="profile-item">
                            <label>Established Year</label>
                            <p>{profile.establishedYear || "-"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Accreditation</label>
                            <p>{profile.accreditation || "-"}</p>
                        </div>

                    </div>

                </div>

                {/* Security */}

                <div className="profile-card">

                    <h2>Security Information</h2>

                    <div className="security-box">

                        <div className="security-item">

                            <label>Verification Status</label>

                            <span
                                className={
                                    profile.status === "verified"
                                        ? "status verified"
                                        : "status pending"
                                }
                            >
                                {profile.status}
                            </span>

                        </div>

                        <div className="security-item">

                            <label>Key ID</label>

                            <p>
                                {profile.keyPair?.keyId || "-"}
                            </p>

                        </div>

                        <div className="security-item">

                            <label>Algorithm</label>

                            <p>
                                {profile.keyPair?.algorithm || "RSA 2048"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>

    );
}