import { API } from "./api";

export const authServiceAPI = {
  login: async (data) => {
    const res = await API.post("/auth/login", data);
    return res;
  },
  logout: async (myID) => {
    const res = await API.post("/auth/logout", { myID: myID });
    return res;
  },
  register: async (data) => {
    const res = await API.post("/auth/register", data);
    return res;
  },
};
