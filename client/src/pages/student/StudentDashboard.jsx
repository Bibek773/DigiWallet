import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaCamera,
  FaCertificate,
  FaCog,
  FaHome,
  FaKey,
  FaLink,
  FaQrcode,
  FaShieldAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaWallet,
} from "react-icons/fa";
import {
  changeMyPassword,
  getMyCredentials,
  getMyProfile,
} from "../../services/studentService";
import "./StudentDashboard.css";

const getCredentialList = (payload) => {
  if (Array.isArray(payload?.credentials)) return payload.credentials;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const studentNavItems = [
  { to: "/student/home", label: "Home", icon: FaHome },
  { to: "/student/mywallet", label: "MyWallet", icon: FaWallet },
  { to: "/student/profile", label: "Profile", icon: FaUserCircle },
  { to: "/student/settings", label: "Settings", icon: FaCog },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [photoPreview, setPhotoPreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [shareOpenId, setShareOpenId] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const activeSection = useMemo(() => {
    if (location.pathname.endsWith("/mywallet")) return "mywallet";
    if (location.pathname.endsWith("/profile")) return "profile";
    if (location.pathname.endsWith("/settings")) return "settings";
    return "home";
  }, [location.pathname]);

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

  useEffect(() => {
    if (!user || user.role !== "student") return;

    let ignore = false;

    const loadDashboardData = async () => {
      setLoadingCredentials(true);
      setDashboardError("");

      try {
        const [profileResponse, credentialsResponse] = await Promise.all([
          getMyProfile(),
          getMyCredentials(),
        ]);

        if (ignore) return;

        setProfile(profileResponse.data?.data || null);
        setCredentials(getCredentialList(credentialsResponse.data));
      } catch (error) {
        if (!ignore) {
          setDashboardError(
            error.response?.data?.message ||
              "Unable to load your student dashboard data."
          );
        }
      } finally {
        if (!ignore) {
          setLoadingCredentials(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, [user]);

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

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
    if (passwordMessage.text) setPasswordMessage({ type: "", text: "" });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      setPasswordSaving(true);
      const response = await changeMyPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage({
        type: "success",
        text: response.data?.message || "Password changed successfully.",
      });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to change password.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "ST";

  const avatarSrc = photoPreview || profile?.Photo || null;

  const getCredentialId = (credential) => credential.id || credential._id;

  const verifyUrl = (credentialId) =>
    `${window.location.origin}/verify/${credentialId}`;

  const qrImageUrl = (credentialId) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
      verifyUrl(credentialId)
    )}`;

  const copyLink = (credentialId) => {
    navigator.clipboard?.writeText(verifyUrl(credentialId));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(date));
  };

  const getCredentialTitle = (credential) =>
    `${credential.level || "Academic"} in ${credential.program || "Program"} - ${
      credential.credentialType || "Credential"
    }`;

  const formatProfileDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(parsedDate);
  };

  const collegeName =
    profile?.College_Id?.collegeName ||
    profile?.College_Id?.name ||
    user?.collegeId?.collegeName ||
    "-";

  if (!user || user.role !== "student") {
    return null;
  }

  return (
    <div className="student-dashboard">
      <header className="topnav">
        <Link
          to="/student/home"
          className="topnav__brand"
          aria-label="Go to student home page"
        >
          DiGiWallet
        </Link>

        <button
          type="button"
          className="profile-preview"
          onClick={() => navigate("/student/profile")}
        >
          <div className="profile-preview__avatar">
            {avatarSrc ? <img src={avatarSrc} alt="" /> : <span>{initials}</span>}
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
        <aside className="sidebar student-sidebar">
          <nav className="sidebar__nav" aria-label="Student dashboard">
            {studentNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
              >
                <Icon className="sidebar__icon" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button className="sidebar__signout" onClick={handleSignOut}>
            <FaSignOutAlt className="sidebar__icon" />
            Sign out
          </button>
        </aside>

        <main className="student-dashboard__content">
          {activeSection === "home" && (
            <section>
              <section className="student-welcome">
                <div>
                  <span>Student Home</span>
                  <h1>Welcome, {user?.name || "Student"}</h1>
                  <p>
                    Your verified academic records, profile, and account
                    security are collected here.
                  </p>
                </div>
                <div className="student-welcome__badge">
                  <FaShieldAlt aria-hidden="true" />
                  <span>{profile?.accountStatus || "approved"}</span>
                </div>
              </section>

              <div className="student-home-grid">
                <Link to="/student/mywallet" className="student-home-card">
                  <FaWallet aria-hidden="true" />
                  <span>MyWallet</span>
                  <strong>{credentials.length}</strong>
                  <small>Issued credential{credentials.length === 1 ? "" : "s"}</small>
                </Link>

                <Link to="/student/profile" className="student-home-card">
                  <FaUserCircle aria-hidden="true" />
                  <span>Profile</span>
                  <strong>{user?.name || "Student"}</strong>
                  <small>{collegeName}</small>
                </Link>

                <Link to="/student/settings" className="student-home-card">
                  <FaKey aria-hidden="true" />
                  <span>Settings</span>
                  <strong>Password</strong>
                  <small>Change your account password</small>
                </Link>
              </div>

              <section className="student-home-panel">
                <div>
                  <h2>Wallet status</h2>
                  <p>
                    New credentials issued by your college appear in MyWallet
                    with their stored verification QR code.
                  </p>
                </div>
                <Link to="/student/mywallet" className="action-btn">
                  <FaCertificate /> Open MyWallet
                </Link>
              </section>
            </section>
          )}

          {activeSection === "mywallet" && (
            <section>
              <h1 className="content-title">MyWallet</h1>
              <p className="content-subtitle">
                Credentials issued to you by your college. Share any of them
                with an employer via link or QR code.
              </p>

              <div className="credential-list">
                {dashboardError && (
                  <div className="dashboard-message dashboard-message--error">
                    {dashboardError}
                  </div>
                )}

                {loadingCredentials && (
                  <div className="dashboard-message">Loading MyWallet...</div>
                )}

                {!loadingCredentials && !dashboardError && credentials.length === 0 && (
                  <div className="dashboard-message">
                    No credentials have been issued to your wallet yet.
                  </div>
                )}

                {!loadingCredentials &&
                  !dashboardError &&
                  credentials.map((cred) => {
                    const credentialId = getCredentialId(cred);
                    const title = getCredentialTitle(cred);

                    return (
                      <div className="credential-item" key={credentialId}>
                        <div className="credential-item__main">
                          <span className="credential-item__degree">{title}</span>
                          <span className="credential-item__meta">
                            {cred.collegeName || "College"} - Issued{" "}
                            {formatDate(cred.createdAt)}
                          </span>
                          <span className="credential-item__meta">
                            Semester {cred.semester || "N/A"} - CGPA{" "}
                            {cred.CGPA ?? "N/A"} - Grade {cred.grade || "N/A"}
                          </span>
                          <span
                            className={`credential-item__status credential-item__status--${cred.status}`}
                          >
                            {cred.status}
                          </span>
                        </div>

                        <div className="credential-item__actions">
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => copyLink(credentialId)}
                          >
                            <FaLink /> Copy link
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() =>
                              setShareOpenId(
                                shareOpenId === credentialId ? null : credentialId
                              )
                            }
                          >
                            <FaQrcode /> QR code
                          </button>
                        </div>

                        {shareOpenId === credentialId && (
                          <div className="qr-panel">
                            <img
                              src={cred.qrCodeData || qrImageUrl(credentialId)}
                              alt={`QR code to verify ${title}`}
                            />
                            <span className="qr-panel__hint">
                              Scan to open the public verification page
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="" />
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
                      {user?.name || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Email</span>
                    <span className="profile-field__value">
                      {user?.email || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">College</span>
                    <span className="profile-field__value">{collegeName}</span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Faculty</span>
                    <span className="profile-field__value">
                      {profile?.Faculty || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Program</span>
                    <span className="profile-field__value">
                      {profile?.Program || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Batch</span>
                    <span className="profile-field__value">
                      {profile?.Batch || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Registration number</span>
                    <span className="profile-field__value">
                      {profile?.RegistrationNumber || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Exam roll no.</span>
                    <span className="profile-field__value">
                      {profile?.RollNo || "-"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Date of birth</span>
                    <span className="profile-field__value">
                      {formatProfileDate(profile?.DOB)}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field__label">Account status</span>
                    <span className="profile-field__value">
                      {profile?.accountStatus || "-"}
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

          {activeSection === "settings" && (
            <section>
              <h1 className="content-title">Settings</h1>
              <p className="content-subtitle">
                Manage your student account security.
              </p>

              <form className="settings-card" onSubmit={handlePasswordSubmit}>
                <div className="settings-card__heading">
                  <FaKey aria-hidden="true" />
                  <div>
                    <h2>Change password</h2>
                    <p>Use your current password to set a new one.</p>
                  </div>
                </div>

                <label className="settings-field">
                  <span>Current password</span>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    minLength="6"
                    required
                  />
                </label>

                <label className="settings-field">
                  <span>New password</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    minLength="6"
                    required
                  />
                </label>

                <label className="settings-field">
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    minLength="6"
                    required
                  />
                </label>

                {passwordMessage.text && (
                  <div className={`settings-message settings-message--${passwordMessage.type}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <button type="submit" className="settings-submit" disabled={passwordSaving}>
                  {passwordSaving ? "Changing password..." : "Change password"}
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
