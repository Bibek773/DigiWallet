import api from "./api";

export const getMyProfile = () => {
  return api.get("/auth/me");
};

export const getMyCredentials = () => {
  return api.get("/credentials/mine");
};

export const changeMyPassword = (data) => {
  return api.patch("/auth/change-password", data);
};
