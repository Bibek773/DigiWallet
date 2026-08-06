import api from "./api";

const unwrap = (response) => {
    const payload = response.data;

    if (payload?.success === false) {
        const error = new Error(payload.message || "Request failed.");
        error.response = response;
        error.data = payload.data;
        throw error;
    }

    return payload;
};

const withBackendMessage = async (request) => {
    try {
        const response = await request();
        return unwrap(response);
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Admin request failed.";
        const nextError = new Error(message);
        nextError.response = error?.response;
        nextError.data = error?.response?.data?.data || error?.data;
        throw nextError;
    }
};

const normalizeId = (item) => item?.id || item?._id;

const normalizeUser = (user) => ({
    id: normalizeId(user),
    name: user?.name || user?.Name || "",
    email: user?.email || user?.Email || "",
    role: user?.role || "",
    status: (user?.status || user?.Status || "").toLowerCase(),
    accountStatus: user?.accountStatus || "",
    college: user?.college || user?.College_Id?.collegeName || "",
    joinedAt: user?.joinedAt || user?.createdAt,
    lastSeen: user?.lastSeen || user?.updatedAt || user?.createdAt,
});

const normalizeCollege = (college) => ({
    id: normalizeId(college),
    collegeName: college?.collegeName || "",
    collegeCode: college?.collegeCode || "",
    email: college?.email || "",
    status: college?.status || "",
    city: college?.city || college?.address?.city || college?.address?.street || "",
    accreditation: college?.accreditation || "",
    issuedCredentialCount:
        college?.issuedCredentialCount || college?.issuedCredentials?.length || 0,
    createdAt: college?.createdAt,
});

const normalizeCredential = (credential) => ({
    id: normalizeId(credential),
    studentName: credential?.studentName || credential?.credentialData?.studentName || "",
    registrationNumber:
        credential?.registrationNumber || credential?.credentialData?.registrationNumber || "",
    collegeName: credential?.collegeName || credential?.credentialData?.collegeName || "",
    program: credential?.program || credential?.credentialData?.program || "",
    semester: credential?.semester || credential?.credentialData?.semester || "",
    CGPA: credential?.CGPA || credential?.credentialData?.CGPA,
    status: credential?.status || "",
    keyId: credential?.keyId || "",
    verificationLink: credential?.verificationLink,
    createdAt: credential?.createdAt || credential?.credentialData?.issuedAt,
    revokedAt: credential?.revokedAt,
});

const normalizeLog = (log) => ({
    id: normalizeId(log),
    credentialId: log?.credentialId || log?.credential?._id || log?.credential?.id,
    credentialName:
        log?.credentialName ||
        log?.credentialType ||
        "",
    studentName: log?.studentName || "",
    collegeName: log?.collegeName || log?.credentialId?.collegeName || "",
    credentialType: log?.credentialType || "",
    verificationMethod: log?.verificationMethod || "",
    actor: log?.actor || "",
    actorEmail: log?.actorEmail || "",
    status: log?.verificationStatus || "",
    ipAddress: log?.ipAddress || "",
    verifiedAt: log?.verifiedAt || "",
});

const normalizeDashboard = (data) => ({
    users: (data?.users || []).map(normalizeUser),
    colleges: (data?.colleges || []).map(normalizeCollege),
    credentials: (data?.credentials || []).map(normalizeCredential),
    verificationLogs: (data?.verificationLogs || []).map(normalizeLog),
    recentVerifications: (data?.recentVerifications || data?.verificationLogs || []).map(normalizeLog),
    verificationStats: {
        totalVerifications: data?.totalVerifications || 0,
        validVerifications: data?.validVerifications || 0,
        revokedVerifications: data?.revokedVerifications || 0,
        tamperedVerifications: data?.tamperedVerifications || 0,
    },
    recentActivity: data?.recentActivity || [],
    metrics: data?.metrics || {
        totalUsers: 0,
        activeStudents: 0,
        colleges: 0,
        issuedCredentials: 0,
        verifications: 0,
    },
});

export const fetchAdminDashboardData = async () => {
    const payload = await withBackendMessage(() => api.get("/admin/dashboard"));
    return normalizeDashboard(payload.data);
};

export const fetchAdminVerificationLogs = async () => {
    const payload = await withBackendMessage(() => api.get("/admin/verification-logs"));
    return (payload.data || []).map(normalizeLog);
};

export const createCollegeWithAccount = async (payload) => {
    return withBackendMessage(() => api.post("/admin/colleges", payload));
};

export const retryCollegeAccountCreation = (collegeId, payload) =>
    withBackendMessage(() => api.post(`/admin/colleges/${collegeId}/account`, payload));

export const updateCollegeStatus = (collegeId, status) =>
    withBackendMessage(() => api.put(`/admin/colleges/${collegeId}`, { status }));

export const deleteCollege = (collegeId) =>
    withBackendMessage(() => api.delete(`/admin/colleges/${collegeId}`));

export const updateUserStatus = (userId, payload) =>
    withBackendMessage(() => api.patch(`/admin/users/${userId}`, payload));

export const deleteUser = (userId) =>
    withBackendMessage(() => api.delete(`/admin/users/${userId}`));

export const revokeCredential = (credentialId) =>
    withBackendMessage(() => api.patch(`/admin/credentials/${credentialId}/revoke`));

export const deleteCredential = (credentialId) =>
    withBackendMessage(() => api.delete(`/admin/credentials/${credentialId}`));
