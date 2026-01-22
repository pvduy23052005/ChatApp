import { API } from "./api";

export const authServiceAPI = {
  login: async (data) => {
    const res = await API.post("/auth/login", data);
    return res;
  },
  logout: async () => {
    const res = await API.post("/auth/logout");
    return res;
  },
};
