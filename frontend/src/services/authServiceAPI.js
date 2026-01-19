import { API } from "./api";

export const authServiceAPI = {
  login: async (data) => {
    const res = await API.post("/auth/login", data);
    console.log(res);
    return res;
  },
};
