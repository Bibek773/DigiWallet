import api from "./api";


export const getCollegeDashboard = () => {
    return api.get("/college/dashboard");
};


export const getStudents = () => {
    return api.get("/college/students");
};


export const getCredentials = () => {
    return api.get("/college/credentials");
};


export const getPendingRequests = () => {
    return api.get("/college/pending-requests");
};


export const getVerificationLogs = () => {
    return api.get("/college/verifications");
};


export const getCollegeProfile = () => {
    return api.get("/college/profile");
};