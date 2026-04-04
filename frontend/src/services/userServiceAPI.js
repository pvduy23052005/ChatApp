import { API } from "./api";

export const userServiceAPI = {
  getUsers: async () => {
    const res = await API.get("/users");
    return res;
  },

  editProfile: async (data) => {
    const res = await API.post("/users/edit/profile", data);
    return res;
  },
};
