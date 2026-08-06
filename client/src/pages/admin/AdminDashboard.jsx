import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaBan,
    FaBars,
    FaBell,
    FaCheckCircle,
    FaClipboardCheck,
    FaEye,
    FaIdBadge,
    FaPlus,
    FaSearch,
    FaShieldAlt,
    FaSignOutAlt,
    FaSyncAlt,
    FaTimesCircle,
    FaTrash,
    FaUniversity,
    FaUserGraduate,
    FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
    deleteCollege,
    deleteCredential,
    deleteUser,
    fetchAdminDashboardData,
    fetchAdminVerificationLogs,
    revokeCredential,
    updateCollegeStatus,
    updateUserStatus,
} from "../../services/adminService";
import "./AdminDashboard.css";

const sections = [
    { id: "overview", label: "Overview", icon: FaShieldAlt },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "colleges", label: "Colleges", icon: FaUniversity },
    { id: "credentials", label: "Credentials", icon: FaIdBadge },
    { id: "verifications", label: "Verifications", icon: FaClipboardCheck },
];

const initialDashboard = {
    users: [],
    colleges: [],
    credentials: [],
    verificationLogs: [],
    recentVerifications: [],
    verificationStats: {
        totalVerifications: 0,
        validVerifications: 0,
        revokedVerifications: 0,
        tamperedVerifications: 0,
    },
    recentActivity: [],
    metrics: {
        totalUsers: 0,
        activeStudents: 0,
        colleges: 0,
        issuedCredentials: 0,
        verifications: 0,
    },
}



const formatNumber = new Intl.NumberFormat("en");
const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

const titleCase = (value) =>
    String(value || "N/A")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return dateFormatter.format(date);
};

const getUserState = (user) =>
    user.accountStatus && user.accountStatus !== "approved"
        ? user.accountStatus
        : user.status || "active";

const deriveMetrics = ({ users, colleges, credentials, verificationLogs }) => ({
    totalUsers: users.length,
    activeStudents: users.filter(
        (user) =>
            user.role === "student" &&
            user.status === "active" &&
            user.accountStatus === "approved"
    ).length,
    colleges: colleges.length,
    issuedCredentials: credentials.length,
    verifications: verificationLogs.length,
});

const deriveRecentActivity = ({ credentials, verificationLogs }) => {
    const issued = credentials.map((credential) => ({
        id: `issued-${credential.id}`,
        type: "Credential issued",
        title: credential.studentName,
        detail: `${credential.collegeName} issued ${credential.registrationNumber}`,
        status: credential.status,
        timestamp: credential.createdAt,
    }));

    const verified = verificationLogs.map((log) => ({
        id: `verified-${log.id}`,
        type: "Verification",
        title: log.credentialName,
        detail: `${log.actor} checked this credential`,
        status: log.verificationStatus,
        timestamp: log.verifiedAt,
    }));
// changed status and timestamp from status and .timestamp to .verificationStatus and . verifiedAt since our backend returns this
    return [...issued, ...verified]
        .filter((activity) => activity.timestamp)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 8);
};

const deriveDashboard = (dashboard) => ({
    ...dashboard,
    metrics: deriveMetrics(dashboard),
    recentActivity: deriveRecentActivity(dashboard),
});

const includesSearch = (values, search) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return values.some((value) => String(value || "").toLowerCase().includes(term));
};

const isSelfRecord = (currentUser, row) => currentUser?.id && row?.id && currentUser.id === row.id;

const requestConfirmation = (entityLabel, actionLabel, row, callback) => {
    setConfirmDialog({
        message: `Are you sure you want to ${actionLabel} ${entityLabel} "${row}"?`,
        callback,
    });
};

const USER_ACTION_LABELS = {
    approve: "approve",
    reject: "reject",
    disable: "disable",
    delete: "delete",
};

const COLLEGE_ACTION_LABELS = {
    approve: "approve",
    reject: "reject",
    disable: "disable",
    delete: "delete",
};

const CREDENTIAL_ACTION_LABELS = {
    revoke: "revoke",
    delete: "delete",
};

function StatusBadge({ status }) {
    const normalized = String(status || "unknown").toLowerCase();

    return (
        <span className={`admin-status admin-status--${normalized}`}>
            {titleCase(normalized)}
        </span>
    );
}

function StateBlock({ icon: Icon = FaShieldAlt, title, message, actionLabel, onAction }) {
    return (
        <section className="admin-state">
            <Icon className="admin-state__icon" aria-hidden="true" />
            <h2>{title}</h2>
            <p>{message}</p>
            {onAction && (
                <button type="button" className="admin-button" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </section>
    );
}

function IconButton({ label, variant = "neutral", disabled, onClick, children }) {
    return (
        <button
            type="button"
            className={`admin-icon-button admin-icon-button--${variant}`}
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function SummaryCard({ label, value, icon: Icon, tone, detail }) {
    return (
        <article className={`admin-summary-card admin-summary-card--${tone}`}>
            <div>
                <span>{label}</span>
                <strong>{formatNumber.format(value)}</strong>
                <small>{detail}</small>
            </div>
            <Icon aria-hidden="true" />
        </article>
    );
}

function SectionHeader({ eyebrow, title, action }) {
    return (
        <div className="admin-section-header">
            <div>
                <span>{eyebrow}</span>
                <h2>{title}</h2>
            </div>
            {action}
        </div>
    );
}

function SearchFilterBar({ search, onSearch, filters = [] }) {
    return (
        <div className="admin-toolbar">
            <label className="admin-search">
                <FaSearch aria-hidden="true" />
                <input
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(event) => onSearch(event.target.value)}
                />
            </label>
            {filters.map((filter) => (
                <label className="admin-select" key={filter.id}>
                    <span>{filter.label}</span>
                    <select
                        value={filter.value}
                        onChange={(event) => filter.onChange(event.target.value)}
                    >
                        {filter.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            ))}
        </div>
    );
}

function DataTable({ columns, rows, emptyTitle, emptyMessage }) {
    return (
        <div className="admin-table-wrap">
            <table className="admin-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            {columns.map((column) => (
                                <td key={column.key}>{column.render(row)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {rows.length === 0 && (
                <div className="admin-empty">
                    <FaSearch aria-hidden="true" />
                    <strong>{emptyTitle}</strong>
                    <span>{emptyMessage}</span>
                </div>
            )}
        </div>
    );
}

function ActivityFeed({ items }) {
    if (items.length === 0) {
        return (
            <div className="admin-empty admin-empty--compact">
                <FaBell aria-hidden="true" />
                <strong>No recent activity</strong>
                <span>Platform activity will appear here as credentials move.</span>
            </div>
        );
    }

    return (
        <ol className="admin-activity">
            {items.map((item) => (
                <li key={item.id}>
                    <span className="admin-activity__marker" aria-hidden="true" />
                    <div>
                        <div className="admin-activity__topline">
                            <strong>{item.type}</strong>
                            <StatusBadge status={item.status} />
                        </div>
                        <p>{item.detail}</p>
                        <time>{formatDate(item.timestamp)}</time>
                    </div>
                </li>
            ))}
        </ol>
    );
}

function DetailDrawer({ item, onClose }) {
    if (!item) return null;

    const hiddenFields = [
        "credentialName",
        "actorEmail",
        "message",
        "timestamp",
        "credentialId",
        "studentId",
        "_id",
        "__v",
    ];

    const fieldLabels = {
        studentName: "Student Name",
        credentialType: "Credential Type",
        verificationStatus: "Verification Status",
        verificationMethod: "Verification Method",
        actor: "Verified By",
        ipAddress: "IP Address",
        verifiedAt: "Verified Date & Time",
    };

    const entries = Object.entries(item.record)
        .filter(
            ([key, value]) =>
                !hiddenFields.includes(key) &&
                value !== undefined &&
                value !== null &&
                typeof value !== "object"
        )
        .map(([key, value]) => ({
                key,
                label: fieldLabels[key] || titleCase(key),
                value:
                    key === "verifiedAt"
                        ? formatDate(value)
                        : key === "ipAddress" && value === "::1"
                            ? "Localhost (::1)"
                            : value,
            }));

    return (
        <div className="admin-drawer-backdrop" role="presentation" onClick={onClose}>
            <aside
                className="admin-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-drawer-title"
                onClick={(event) => event.stopPropagation()}
            >
                <header>
                    <div>
                        <span>{item.type}</span>
                        <h2 id="admin-drawer-title">{item.title}</h2>
                    </div>
                    <IconButton label="Close details" onClick={onClose}>
                        <FaTimesCircle aria-hidden="true" />
                    </IconButton>
                </header>
                <dl>
                    {entries.map(({ key, label, value }) => (
                        <div key={key}>
                            <dt>{label}</dt>
                            <dd>{String(value)}</dd>
                        </div>
                    ))}
                </dl>
            </aside>
        </div>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const[confirmDialog,setConfirmDialog]=useState(null);
    const [activeSection, setActiveSection] = useState("overview");
    const [dashboard, setDashboard] = useState(initialDashboard);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [busyAction, setBusyAction] = useState("");
    const [drawerItem, setDrawerItem] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [allLogsLoaded, setAllLogsLoaded] = useState(false);
    const [filters, setFilters] = useState({
        users: { search: "", role: "all", status: "all" },
        colleges: { search: "", status: "all" },
        credentials: { search: "", status: "all" },
        verifications: { search: "", status: "all" },
    });

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await fetchAdminDashboardData();
            setDashboard({ ...initialDashboard, ...data });
            setAllLogsLoaded(false);
        } catch (requestError) {
            setError(
                requestError.message ||
                    requestError.response?.data?.message ||
                    "Admin data could not be loaded. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = setTimeout(() => setToast(""), 2800);
        return () => clearTimeout(timeout);
    }, [toast]);

    const setSectionFilter = (section, key, value) => {
        setFilters((current) => ({
            ...current,
            [section]: {
                ...current[section],
                [key]: value,
            },
        }));
    };

    const openVerificationLogs = async () => {
        setActiveSection("verifications");
        if (allLogsLoaded) return;
        try {
            const logs = await fetchAdminVerificationLogs();
            setDashboard((current) => ({ ...current, verificationLogs: logs }));
            setAllLogsLoaded(true);
        } catch (requestError) {
            setToast(requestError.message || "Verification logs could not be loaded.");
        }
    };

    const filteredUsers = useMemo(() => {
        const { search, role, status } = filters.users;

        return dashboard.users.filter((row) => {
            const state = getUserState(row);
            return (
                includesSearch([row.name, row.email, row.role, row.college, state], search) &&
                (role === "all" || row.role === role) &&
                (status === "all" || state === status || row.status === status)
            );
        });
    }, [dashboard.users, filters.users]);

    const filteredColleges = useMemo(() => {
        const { search, status } = filters.colleges;

        return dashboard.colleges.filter(
            (row) =>
                includesSearch(
                    [row.collegeName, row.collegeCode, row.email, row.city, row.status],
                    search
                ) && (status === "all" || row.status === status)
        );
    }, [dashboard.colleges, filters.colleges]);

    const filteredCredentials = useMemo(() => {
        const { search, status } = filters.credentials;

        return dashboard.credentials.filter(
            (row) =>
                includesSearch(
                    [
                        row.studentName,
                        row.registrationNumber,
                        row.collegeName,
                        row.program,
                        row.status,
                    ],
                    search
                ) && (status === "all" || row.status === status)
        );
    }, [dashboard.credentials, filters.credentials]);

    const filteredLogs = useMemo(() => {
        const { search, status } = filters.verifications;

        return dashboard.verificationLogs.filter(
            (row) =>
                includesSearch(
                    [row.credentialName, row.actor, row.actorEmail, row.status, row.message],
                    search
                ) && (status === "all" || row.status === status)
        );
    }, [dashboard.verificationLogs, filters.verifications]);

    const updateDashboard = (updater) => {
        setDashboard((current) => deriveDashboard(updater(current)));
    };

    const runAction = async (actionKey, action, successMessage) => {
        setBusyAction(actionKey);

        try {
            const result = await action();
            setToast(result?.message || successMessage);
        } catch (actionError) {
            setToast(
                actionError.message ||
                    actionError.response?.data?.message ||
                    "Action could not be completed."
            );
        } finally {
            setBusyAction("");
        }
    };

    const openDrawer = (type, title, record) => {
        setDrawerItem({ type, title, record });
    };

    const handleUserAction = (action, row) => {
        const selfRecord = isSelfRecord(user, row);

        if (action === "view") {
            openDrawer("User", row.name, row);
            return;
        }

        if (selfRecord) {
            setToast("You cannot change or delete your own admin account.");
            return;
        }

        if (!confirmAdminAction("user", USER_ACTION_LABELS[action], row.name)) {
            return;
        }

        const updates = {
            approve: { accountStatus: "approved", status: "active" },
            reject: { accountStatus: "rejected" },
            disable: { status: "inactive" },
        };

        runAction(
            `user-${action}-${row.id}`,
            async () => {
                if (action === "delete") {
                    const result = await deleteUser(row.id);
                    updateDashboard((current) => ({
                        ...current,
                        users: current.users.filter((userRow) => userRow.id !== row.id),
                    }));
                    return result;
                }

                const result = await updateUserStatus(row.id, updates[action]);
                updateDashboard((current) => ({
                    ...current,
                    users: current.users.map((userRow) =>
                        userRow.id === row.id ? { ...userRow, ...updates[action] } : userRow
                    ),
                }));
                return result;
            },
            `User ${action} completed.`
        );
    };

    const handleCollegeAction = (action, row) => {
        if (action === "view") {
            openDrawer("College", row.collegeName, row);
            return;
        }

        if (!confirmAdminAction("college", COLLEGE_ACTION_LABELS[action], row.collegeName)) {
            return;
        }

        const statusByAction = {
            approve: "verified",
            reject: "rejected",
            disable: "inactive",
        };

        runAction(
            `college-${action}-${row.id}`,
            async () => {
                if (action === "delete") {
                    const result = await deleteCollege(row.id);
                    updateDashboard((current) => ({
                        ...current,
                        colleges: current.colleges.filter((collegeRow) => collegeRow.id !== row.id),
                    }));
                    return result;
                }

                const result = await updateCollegeStatus(row.id, statusByAction[action]);
                updateDashboard((current) => ({
                    ...current,
                    colleges: current.colleges.map((collegeRow) =>
                        collegeRow.id === row.id
                            ? { ...collegeRow, status: statusByAction[action] }
                            : collegeRow
                    ),
                }));
                return result;
            },
            `College ${action} completed.`
        );
    };

    const handleCredentialAction = (action, row) => {
    if (action === "view") {
        openDrawer("Credential", row.registrationNumber, row);
        return;
    }

    setConfirmDialog({
        message: `Are you sure you want to ${CREDENTIAL_ACTION_LABELS[action]} credential ${row.registrationNumber}?`,
        action: async () => {
            await runAction(
                `credential-${action}-${row.id}`,
                async () => {
                    if (action === "delete") {
                        const result = await deleteCredential(row.id);

                        updateDashboard((current) => ({
                            ...current,
                            credentials: current.credentials.filter(
                                (credentialRow) => credentialRow.id !== row.id
                            ),
                        }));

                        return result;
                    }

                    const result = await revokeCredential(row.id);

                    updateDashboard((current) => ({
                        ...current,
                        credentials: current.credentials.map((credentialRow) =>
                            credentialRow.id === row.id
                                ? {
                                      ...credentialRow,
                                      status: "revoked",
                                      revokedAt: new Date().toISOString(),
                                  }
                                : credentialRow
                        ),
                    }));

                    return result;
                },
                `Credential ${action} completed.`
            );
        },
    });
};

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const stats = [
        {
            label: "Total users",
            value: dashboard.metrics.totalUsers,
            icon: FaUsers,
            tone: "blue",
            detail: "Across students, colleges, and admins",
        },
        {
            label: "Active students",
            value: dashboard.metrics.activeStudents,
            icon: FaUserGraduate,
            tone: "green",
            detail: "Approved student wallet holders",
        },
        {
            label: "Colleges",
            value: dashboard.metrics.colleges,
            icon: FaUniversity,
            tone: "amber",
            detail: "Registered issuing institutions",
        },
        {
            label: "Issued credentials",
            value: dashboard.metrics.issuedCredentials,
            icon: FaIdBadge,
            tone: "violet",
            detail: "Signed credential records",
        },
        {
            label: "Verifications",
            value: dashboard.metrics.verifications,
            icon: FaClipboardCheck,
            tone: "rose",
            detail: "Recorded verification events",
        },
    ];

    const verificationStats = [
        { label: "Total Verifications", value: dashboard.verificationStats.totalVerifications, icon: FaClipboardCheck, tone: "blue", detail: "All credential checks" },
        { label: "Valid Verifications", value: dashboard.verificationStats.validVerifications, icon: FaCheckCircle, tone: "green", detail: "Verified successfully" },
        { label: "Revoked Verifications", value: dashboard.verificationStats.revokedVerifications, icon: FaBan, tone: "rose", detail: "Revoked credentials checked" },
        { label: "Tampered / Invalid", value: dashboard.verificationStats.tamperedVerifications, icon: FaTimesCircle, tone: "amber", detail: "Tampered or invalid signatures" },
    ];

    const userColumns = [
        {
            key: "user",
            header: "User",
            render: (row) => (
                <div className="admin-primary-cell">
                    <strong>{row.name}</strong>
                    <span>{row.email}</span>
                </div>
            ),
        },
        { key: "role", header: "Role", render: (row) => titleCase(row.role) },
        { key: "college", header: "College", render: (row) => row.college },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <div className="admin-badge-stack">
                    <StatusBadge status={getUserState(row)} />
                </div>
            ),
        },
        { key: "lastSeen", header: "Last seen", render: (row) => formatDate(row.lastSeen) },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="admin-row-actions">
                    <IconButton label="View user" onClick={() => handleUserAction("view", row)}>
                        <FaEye aria-hidden="true" />
                    </IconButton>
                    {isSelfRecord(user, row) ? (
                        <span className="admin-row-note">Current account</span>
                    ) : (
                        <>
                            <IconButton
                                label="Approve user"
                                variant="success"
                                disabled={busyAction === `user-approve-${row.id}`}
                                onClick={() => handleUserAction("approve", row)}
                            >
                                <FaCheckCircle aria-hidden="true" />
                            </IconButton>
                            <IconButton
                                label="Reject user"
                                variant="warning"
                                disabled={busyAction === `user-reject-${row.id}`}
                                onClick={() => handleUserAction("reject", row)}
                            >
                                <FaTimesCircle aria-hidden="true" />
                            </IconButton>
                            <IconButton
                                label="Disable user"
                                variant="danger"
                                disabled={busyAction === `user-disable-${row.id}`}
                                onClick={() => handleUserAction("disable", row)}
                            >
                                <FaBan aria-hidden="true" />
                            </IconButton>
                            <IconButton
                                label="Delete user"
                                variant="danger"
                                disabled={busyAction === `user-delete-${row.id}`}
                                onClick={() => handleUserAction("delete", row)}
                            >
                                <FaTrash aria-hidden="true" />
                            </IconButton>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const collegeColumns = [
        {
            key: "college",
            header: "College",
            render: (row) => (
                <div className="admin-primary-cell">
                    <strong>{row.collegeName}</strong>
                    <span>{row.email}</span>
                </div>
            ),
        },
        { key: "code", header: "Code", render: (row) => row.collegeCode },
        { key: "city", header: "City", render: (row) => row.city },
        { key: "credentials", header: "Credentials", render: (row) => row.issuedCredentialCount },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="admin-row-actions">
                    <IconButton label="View college" onClick={() => handleCollegeAction("view", row)}>
                        <FaEye aria-hidden="true" />
                    </IconButton>
                    <IconButton
                        label="Approve college"
                        variant="success"
                        disabled={busyAction === `college-approve-${row.id}`}
                        onClick={() => handleCollegeAction("approve", row)}
                    >
                        <FaCheckCircle aria-hidden="true" />
                    </IconButton>
                    <IconButton
                        label="Reject college"
                        variant="warning"
                        disabled={busyAction === `college-reject-${row.id}`}
                        onClick={() => handleCollegeAction("reject", row)}
                    >
                        <FaTimesCircle aria-hidden="true" />
                    </IconButton>
                    <IconButton
                        label="Disable college"
                        variant="danger"
                        disabled={busyAction === `college-disable-${row.id}`}
                        onClick={() => handleCollegeAction("disable", row)}
                    >
                        <FaBan aria-hidden="true" />
                    </IconButton>
                    <IconButton
                        label="Delete college"
                        variant="danger"
                        disabled={busyAction === `college-delete-${row.id}`}
                        onClick={() => handleCollegeAction("delete", row)}
                    >
                        <FaTrash aria-hidden="true" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const credentialColumns = [
        {
            key: "credential",
            header: "Credential",
            render: (row) => (
                <div className="admin-primary-cell">
                    <strong>{row.studentName}</strong>
                    <span>{row.registrationNumber}</span>
                </div>
            ),
        },
        { key: "college", header: "College", render: (row) => row.collegeName },
        { key: "program", header: "Program", render: (row) => titleCase(row.program) },
        { key: "issued", header: "Issued", render: (row) => formatDate(row.createdAt) },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="admin-row-actions">
                    <IconButton
                        label="View credential"
                        onClick={() => handleCredentialAction("view", row)}
                    >
                        <FaEye aria-hidden="true" />
                    </IconButton>
                    <IconButton
                        label="Revoke credential"
                        variant="warning"
                        disabled={
                            row.status === "revoked" ||
                            busyAction === `credential-revoke-${row.id}`
                        }
                        onClick={() => handleCredentialAction("revoke", row)}
                    >
                        <FaBan aria-hidden="true" />
                    </IconButton>
                    <IconButton
                        label="Delete credential"
                        variant="danger"
                        disabled={busyAction === `credential-delete-${row.id}`}
                        onClick={() => handleCredentialAction("delete", row)}
                    >
                        <FaTrash aria-hidden="true" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const logColumns = [
        {
            key: "credential",
            header: "Credential",
            render: (row) => (
                <div className="admin-primary-cell">
                    <strong>{row.studentName}</strong>
                    <span>{row.credentialType}</span>
                </div>
            ),
        },
        {
            key: "actor",
            header: "Actor",
            render: (row) => (
                <div className="admin-primary-cell">
                    <strong>{row.actor || "-"}</strong>
                    <span>{row.actorEmail}</span>
                </div>
            ),
        },
        { key: "ipAddress", header: "IP", render: (row) => row.ipAddress || "-" },
        { key: "verifiedAt", header: "Timestamp", render: (row) => formatDate(row.verifiedAt) }, //for table in verification page
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="admin-row-actions">
                    <IconButton
                        label="View verification log"
                        onClick={() => openDrawer("Verification log", row.credentialType, row)}
                    >
                        <FaEye aria-hidden="true" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const recentVerificationColumns = [
        { key: "studentName", header: "Student Name", render: (row) => row.studentName || "N/A" },
        { key: "collegeName", header: "College Name", render: (row) => row.collegeName || "N/A" },
        { key: "credentialType", header: "Credential Type", render: (row) => row.credentialType || "N/A" },
        { key: "verificationMethod", header: "Verification Method", render: (row) => titleCase(row.verificationMethod) },
        { key: "status", header: "Verification Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "verifiedAt", header: "Verified Date & Time", render: (row) => formatDate(row.verifiedAt) },
    ];

    const renderSection = () => {
        if (loading) {
            return (
                <StateBlock
                    icon={FaSyncAlt}
                    title="Loading admin dashboard"
                    message="Fetching the latest platform records."
                />
            );
        }

        if (error) {
            return (
                <StateBlock
                    icon={FaTimesCircle}
                    title="Dashboard unavailable"
                    message={error}
                    actionLabel="Retry"
                    onAction={loadDashboard}
                />
            );
        }

        if (activeSection === "overview") {
            return (
                <>
                    <section className="admin-summary-grid">
                        {stats.map((stat) => (
                            <SummaryCard key={stat.label} {...stat} />
                        ))}
                    </section>

                    <SectionHeader eyebrow="Verification summary" title="Credential verification health" />
                    <section className="admin-summary-grid admin-summary-grid--verification">
                        {verificationStats.map((stat) => (
                            <SummaryCard key={stat.label} {...stat} />
                        ))}
                    </section>

                    <section className="admin-overview-grid">
                        <div className="admin-panel">
                            <SectionHeader eyebrow="Live feed" title="Recent activity" />
                            <ActivityFeed items={dashboard.recentActivity} />
                        </div>
                        <div className="admin-panel">
                            <SectionHeader
                                eyebrow="Audit"
                                title="Recent verification activity"
                                action={<button type="button" className="admin-button admin-button--inline" onClick={openVerificationLogs}>View All Verification Logs</button>}
                            />
                            <DataTable
                                columns={recentVerificationColumns}
                                rows={dashboard.recentVerifications}
                                emptyTitle="No verification logs"
                                emptyMessage="Verification events will appear once credentials are checked."
                            />
                        </div>
                    </section>
                </>
            );
        }

        if (activeSection === "users") {
            return (
                <section className="admin-panel">
                    <SectionHeader eyebrow="Identity" title="Manage users" />
                    <SearchFilterBar
                        search={filters.users.search}
                        onSearch={(value) => setSectionFilter("users", "search", value)}
                        filters={[
                            {
                                id: "role",
                                label: "Role",
                                value: filters.users.role,
                                onChange: (value) => setSectionFilter("users", "role", value),
                                options: [
                                    { value: "all", label: "All roles" },
                                    { value: "student", label: "Students" },
                                    { value: "college", label: "Colleges" },
                                    { value: "super_admin", label: "Admins" },
                                ],
                            },
                            {
                                id: "status",
                                label: "Status",
                                value: filters.users.status,
                                onChange: (value) => setSectionFilter("users", "status", value),
                                options: [
                                    { value: "all", label: "All statuses" },
                                    { value: "active", label: "Active" },
                                    { value: "inactive", label: "Inactive" },
                                    { value: "pending", label: "Pending" },
                                    { value: "approved", label: "Approved" },
                                    { value: "rejected", label: "Rejected" },
                                ],
                            },
                        ]}
                    />
                    <DataTable
                        columns={userColumns}
                        rows={filteredUsers}
                        emptyTitle="No users found"
                        emptyMessage="No user records match the current filters."
                    />
                </section>
            );
        }

        if (activeSection === "colleges") {
            return (
                <section className="admin-panel">
                    <SectionHeader
                        eyebrow="Institutions"
                        title="Manage colleges"
                        action={
                            <button
                                type="button"
                                className="admin-button admin-button--inline"
                                onClick={() => navigate("/admin/colleges/create")}
                            >
                                <FaPlus aria-hidden="true" />
                                <span>Create college</span>
                            </button>
                        }
                    />
                    <SearchFilterBar
                        search={filters.colleges.search}
                        onSearch={(value) => setSectionFilter("colleges", "search", value)}
                        filters={[
                            {
                                id: "status",
                                label: "Status",
                                value: filters.colleges.status,
                                onChange: (value) => setSectionFilter("colleges", "status", value),
                                options: [
                                    { value: "all", label: "All statuses" },
                                    { value: "pending", label: "Pending" },
                                    { value: "verified", label: "Verified" },
                                    { value: "rejected", label: "Rejected" },
                                    { value: "inactive", label: "Inactive" },
                                ],
                            },
                        ]}
                    />
                    <DataTable
                        columns={collegeColumns}
                        rows={filteredColleges}
                        emptyTitle="No colleges found"
                        emptyMessage="No college records match the current filters."
                    />
                </section>
            );
        }

        if (activeSection === "credentials") {
            return (
                <section className="admin-panel">
                    <SectionHeader eyebrow="Credentials" title="Issued credentials" />
                    <SearchFilterBar
                        search={filters.credentials.search}
                        onSearch={(value) => setSectionFilter("credentials", "search", value)}
                        filters={[
                            {
                                id: "status",
                                label: "Status",
                                value: filters.credentials.status,
                                onChange: (value) =>
                                    setSectionFilter("credentials", "status", value),
                                options: [
                                    { value: "all", label: "All statuses" },
                                    { value: "valid", label: "Valid" },
                                    { value: "revoked", label: "Revoked" },
                                ],
                            },
                        ]}
                    />
                    <DataTable
                        columns={credentialColumns}
                        rows={filteredCredentials}
                        emptyTitle="No credentials found"
                        emptyMessage="No credential records match the current filters."
                    />
                </section>
            );
        }

        return (
            <section className="admin-panel">
                <SectionHeader eyebrow="Audit" title="Verification logs" />
                <SearchFilterBar
                    search={filters.verifications.search}
                    onSearch={(value) => setSectionFilter("verifications", "search", value)}
                    filters={[
                        {
                            id: "status",
                            label: "Status",
                            value: filters.verifications.status,
                            onChange: (value) => setSectionFilter("verifications", "status", value),
                            options: [
                                { value: "all", label: "All statuses" },
                                { value: "valid", label: "Valid" },
                                { value: "revoked", label: "Revoked" },
                                { value: "tampered", label: "Tampered" },
                                { value: "invalid_signature", label: "Invalid signature" },
                            ],
                        },
                    ]}
                />
                <DataTable
                    columns={logColumns}
                    rows={filteredLogs}
                    emptyTitle="No logs found"
                    emptyMessage="No verification logs match the current filters."
                />
            </section>
        );
    };

    const currentSection = sections.find((section) => section.id === activeSection);

    return (
        <main className="admin-page">
            <aside className={`admin-sidebar ${mobileNavOpen ? "admin-sidebar--open" : ""}`}>
                <button
                    type="button"
                    className="admin-brand admin-brand--button"
                    aria-label="Go to admin overview"
                    onClick={() => {
                        setActiveSection("overview");
                        setMobileNavOpen(false);
                    }}
                >
                    <span className="admin-brand__mark">DW</span>
                    <div>
                        <strong>DigiWallet</strong>
                        <small>Admin Console</small>
                    </div>
                </button>

                <nav className="admin-nav" aria-label="Admin sections">
                    {sections.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            className={activeSection === id ? "is-active" : ""}
                            onClick={() => {
                                setActiveSection(id);
                                setMobileNavOpen(false);
                                if (id === "verifications") openVerificationLogs();
                            }}
                        >
                            <Icon aria-hidden="true" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

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

            <section className="admin-main">
                <header className="admin-topbar">
                    <button
                        type="button"
                        className="admin-menu-button"
                        aria-label="Toggle admin navigation"
                        onClick={() => setMobileNavOpen((current) => !current)}
                    >
                        <FaBars aria-hidden="true" />
                    </button>
                    <div>
                        <span>{currentSection?.label}</span>
                        <h1>Platform control center </h1>
                    </div>
                    <button type="button" className="admin-refresh" onClick={loadDashboard}>
                        <FaSyncAlt aria-hidden="true" />
                        <span>Refresh</span>
                    </button>
                </header>

                {renderSection()}
            </section>

            {toast && <div className="admin-toast">{toast}</div>}
            {confirmDialog && (
                    <div className="confirm-overlay">
                        <div className="confirm-box">
                            <h3>Confirm Action</h3>

                            <p>{confirmDialog.message}</p>

                            <div className="confirm-actions">
                                <button
                                    type="button"
                                    onClick={() => setConfirmDialog(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="confirm-danger"
                                    onClick={() => {
                                        confirmDialog.action();
                                        setConfirmDialog(null);
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            <DetailDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
        </main>
    );
}
