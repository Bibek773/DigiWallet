import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRedo,
    FaSave,
    FaSignOutAlt,
    FaUniversity,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
    createCollegeWithAccount,
    retryCollegeAccountCreation,
} from "../../services/adminService";
import "./AdminDashboard.css";
import "./CreateCollegePage.css";

const initialForm = {
    collegeName: "",
    collegeCode: "",
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
    accreditation: "",
    establishedYear: "",
    adminName: "",
    adminContact: "",
    loginEmail: "",
    initialPassword: "",
};

const getStatusIcon = (type) => {
    if (type === "warning" || type === "error") {
        return <FaExclamationTriangle aria-hidden="true" />;
    }

    return <FaCheckCircle aria-hidden="true" />;
};

export default function CreateCollegePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [partialFailure, setPartialFailure] = useState(null);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        if (status.type === "error") setStatus({ type: "", message: "" });
    };

    const buildPayload = () => ({
        collegeName: form.collegeName.trim(),
        collegeCode: form.collegeCode.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        website: form.website.trim(),
        accreditation: form.accreditation.trim(),
        establishedYear: Number(form.establishedYear),
        adminName: form.adminName.trim(),
        adminContact: form.adminContact.trim(),
        loginEmail: form.loginEmail.trim(),
        initialPassword: form.initialPassword,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus({ type: "", message: "" });
        setPartialFailure(null);

        try {
            const result = await createCollegeWithAccount(buildPayload());
            setStatus({
                type: "success",
                message: result.message || "College and login account created successfully.",
            });
            setForm(initialForm);
        } catch (error) {
            const partialFailureData = error.data?.partialFailure ? error.data : null;
            setStatus({
                type: partialFailureData ? "warning" : "error",
                message: error.response?.data?.message || error.message || "College creation failed.",
            });
            setPartialFailure(partialFailureData);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = async () => {
        if (!partialFailure?.college?.id && !partialFailure?.college?._id) return;

        setRetrying(true);
        setStatus({ type: "", message: "" });

        try {
            const collegeId = partialFailure.college.id || partialFailure.college._id;
            const result = await retryCollegeAccountCreation(collegeId, {
                adminName: form.adminName.trim(),
                adminContact: form.adminContact.trim(),
                loginEmail: form.loginEmail.trim(),
                initialPassword: form.initialPassword,
            });

            setPartialFailure(null);
            setStatus({
                type: "success",
                message: result.message || "College login account created successfully.",
            });
            setForm(initialForm);
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "Account retry failed.",
            });
        } finally {
            setRetrying(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <main className="admin-create-page">
            <aside className="admin-create-sidebar">
                <div className="admin-brand">
                    <span className="admin-brand__mark">DW</span>
                    <div>
                        <strong>DigiWallet</strong>
                        <small>Admin Console</small>
                    </div>
                </div>

                <Link className="admin-create-back" to="/admin/dashboard">
                    <FaArrowLeft aria-hidden="true" />
                    <span>Back to dashboard</span>
                </Link>

                <div className="admin-account">
                    <div>
                        <strong>{user?.name || "Admin"}</strong>
                        <span>{user?.email}</span>
                    </div>
                    <button type="button" onClick={handleLogout}>
                        <FaSignOutAlt aria-hidden="true" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <section className="admin-create-main">
                <header className="admin-topbar">
                    <div className="admin-create-heading">
                        <span>Institutions</span>
                        <h1>Create college</h1>
                    </div>
                </header>

                <form className="admin-create-form" onSubmit={handleSubmit}>
                    <section className="admin-form-panel">
                        <div className="admin-form-panel__heading">
                            <FaUniversity aria-hidden="true" />
                            <div>
                                <span>College profile</span>
                                <h2>Institution details</h2>
                            </div>
                        </div>

                        <div className="admin-form-grid">
                            <label>
                                <span>College name</span>
                                <input name="collegeName" value={form.collegeName} onChange={updateField} required />
                            </label>
                            <label>
                                <span>College code</span>
                                <input name="collegeCode" value={form.collegeCode} onChange={updateField} required />
                            </label>
                            <label>
                                <span>College email</span>
                                <input name="email" type="email" value={form.email} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Phone number</span>
                                <input name="phoneNumber" value={form.phoneNumber} onChange={updateField} required />
                            </label>
                            <label className="admin-form-grid__wide">
                                <span>Address</span>
                                <textarea name="address" value={form.address} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Website</span>
                                <input name="website" type="url" value={form.website} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Accreditation</span>
                                <input name="accreditation" value={form.accreditation} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Established year</span>
                                <input
                                    name="establishedYear"
                                    type="number"
                                    min="1800"
                                    max="2100"
                                    value={form.establishedYear}
                                    onChange={updateField}
                                    required
                                />
                            </label>
                        </div>
                    </section>

                    <section className="admin-form-panel">
                        <div className="admin-form-panel__heading">
                            <FaCheckCircle aria-hidden="true" />
                            <div>
                                <span>College login</span>
                                <h2>Admin account</h2>
                            </div>
                        </div>

                        <div className="admin-form-grid">
                            <label>
                                <span>Admin name</span>
                                <input name="adminName" value={form.adminName} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Admin contact</span>
                                <input name="adminContact" value={form.adminContact} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Login email</span>
                                <input name="loginEmail" type="email" value={form.loginEmail} onChange={updateField} required />
                            </label>
                            <label>
                                <span>Initial password</span>
                                <input
                                    name="initialPassword"
                                    type="password"
                                    minLength="6"
                                    value={form.initialPassword}
                                    onChange={updateField}
                                    required
                                />
                            </label>
                        </div>
                    </section>

                    {status.message && (
                        <div className={`admin-create-status admin-create-status--${status.type}`}>
                            {getStatusIcon(status.type)}
                            <span>{status.message}</span>
                        </div>
                    )}

                    {partialFailure && (
                        <section className="admin-partial">
                            <strong>College record created without a login account.</strong>
                            <span>
                                Use retry after fixing the account credentials. College ID:
                                {" "}
                                {partialFailure.college?.id || partialFailure.college?._id}
                            </span>
                            <button type="button" onClick={handleRetry} disabled={retrying}>
                                <FaRedo aria-hidden="true" />
                                <span>{retrying ? "Retrying..." : "Retry account creation"}</span>
                            </button>
                        </section>
                    )}

                    <div className="admin-create-actions">
                        <Link to="/admin/dashboard">Cancel</Link>
                        <button type="submit" disabled={submitting || retrying}>
                            <FaSave aria-hidden="true" />
                            <span>{submitting ? "Creating..." : "Create college and account"}</span>
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
