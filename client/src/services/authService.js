import api from "./api";

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

export const registerStudent = (data) => {
    return api.post("/auth/signup", data);
};
/* this is the file our LoginPage.jsx uses. It doesnot directly use axios. instead, it uses configured axios instance from ./api which is api.js */