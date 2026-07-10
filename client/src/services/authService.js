import api from "./api";

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

export const registerStudent = (data) => {
    return api.post("/auth/signup", data);
};
