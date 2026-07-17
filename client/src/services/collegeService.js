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
export const issueCredential = (data)=>{

    return api.post(
        "/credentials/issue",
        data
    );

};
export const revokeCredential = (id)=>{

    return api.put(
        `/credentials/${id}/revoke`
    );

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

export const updateSettings=(data)=>{
    return api.put("/college/settings",data);
}
export const getAllColleges = ()=>{

    return api.get("/college/list");

};
export const approveStudent = (studentId) => {

    return api.put(`/college/students/${studentId}/approve`);

};


export const deleteStudent = (studentId) => {

    return api.delete(`/college/students/${studentId}`);

};