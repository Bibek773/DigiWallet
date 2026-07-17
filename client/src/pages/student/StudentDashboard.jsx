import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaCertificate,
  FaUserCircle,
  FaSignOutAlt,
  FaLink,
  FaQrcode,
  FaCamera,
} from "react-icons/fa";
import "./StudentDashboard.css";

const credentials = [
  {
    id: "CRED-2026-001",
    degree: "Bachelor in Computer Engineering",
    college: "Cosmos College of Engineering",
    issueDate: "2026-05-06",
    status: "valid",
  },
  {
    id: "CRED-2026-014",
    degree: "SEE Certificate",
    college: "Cosmos College of Engineering",
    issueDate: "2022-06-15",
    status: "valid",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("credentials");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [shareOpenId, setShareOpenId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "super_admin" || user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (user.role === "college") {
      navigate("/college/dashboard", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "ST";

  const verifyUrl = (credentialId) =>
    `${window.location.origin}/verify/${credentialId}`;

  const qrImageUrl = (credentialId) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
      verifyUrl(credentialId)
    )}`;

  const copyLink = (credentialId) => {
    navigator.clipboard.writeText(verifyUrl(credentialId));
  };

  if (!user || user.role !== "student") {
    return null;
  }

  return (
    <div className="student-dashboard">

      <header className="topnav">
        <Link to="/" className="topnav__brand" aria-label="Go to home page">
          DiGiWallet
        </Link>

        <button
          className="profile-preview"
          onClick={() => setActiveSection("profile")}
        >
          <div className="profile-preview__avatar">
            {photoPreview ? (
              <img src={photoPreview} alt="" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="profile-preview__info">
            <span className="profile-preview__name">
              {user?.name || "Student Name"}
            </span>
            <span className="profile-preview__role">Student</span>
          </div>
        </button>
      </header>

      <div className="student-dashboard__body">

        <aside className="sidebar">
          <nav className="sidebar__nav">
            <button
              className={`sidebar__link ${
                activeSection === "credentials" ? "sidebar__link--active" : ""
              }`}
              onClick={() => setActiveSection("credentials")}
            >
              <FaCertificate className="sidebar__icon" />
              Credentials
            </button>

            <button
              className={`sidebar__link ${
                activeSection === "profile" ? "sidebar__link--active" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <FaUserCircle className="sidebar__icon" />
              Profile
            </button>
          </nav>

          <button className="sidebar__signout" onClick={handleSignOut}>
            <FaSignOutAlt className="sidebar__icon" />
            Sign out
          </button>
        </aside>

        <main className="student-dashboard__content">

          {activeSection === "credentials" && (
            <section>
              <h1 className="content-title">My Credentials</h1>
              <p className="content-subtitle">
                Credentials issued to you by your college. Share any of them
                with an employer via link or QR code.
              </p>

              <div className="credential-list">
                {credentials.map((cred) => (
                  <div className="credential-item" key={cred.id}>
                    <div className="credential-item__main">
                      <span className="credential-item__degree">
                        {cred.degree}
                      </span>
                      <span className="credential-item__meta">
                        {cred.college} · Issued {cred.issueDate}
                      </span>
                      <span
                        className={`credential-item__status credential-item__status--${cred.status}`}
                      >
                        {cred.status}
                      </span>
                    </div>

                    <div className="credential-item__actions">
                      <button
                        className="action-btn"
                        onClick={() => copyLink(cred.id)}
                      >
                        <FaLink /> Copy link
                      </button>
                      <button
                        className="action-btn"
                        onClick={() =>
                          setShareOpenId(
                            shareOpenId === cred.id ? null : cred.id
                          )
                        }
                      >
                        <FaQrcode /> QR code
                      </button>
                    </div>

                    {shareOpenId === cred.id && (
                      <div className="qr-panel">
                        <img
                          src={qrImageUrl(cred.id)}
                          alt={`QR code to verify ${cred.degree}`}
                        />
                        <span className="qr-panel__hint">
                          Scan to open the public verification page
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "profile" && (
            <section>
              <h1 className="content-title">Profile</h1>
              <p className="content-subtitle">
                Information you provided when registering.
              </p>

              <div className="profile-card">
                <div className="profile-card__photo-section">
                  <div className="profile-card__avatar">
                    {photoPreview ? (
                      <img src={photoPreview} alt="" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <label className="photo-upload-btn">
                    <FaCamera /> Change photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="profile-card__details">
                  <div className="profile-field">
                    <span className="profile-field__label">Full name</span>
                    <span className="profile-field__value">
                      {user?.name || "—"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Email</span>
                    <span className="profile-field__value">
                      {user?.email || "—"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">College</span>
                    <span className="profile-field__value">
                      {user?.collegeId?.collegeName || "—"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Role</span>
                    <span className="profile-field__value">Student</span>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
