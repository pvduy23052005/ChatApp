import { API } from "./api";

export const userServiceAPI = {
  getUsers: async () => {
    const res = await API.get("/users");
    return res;
  },
  getUserAccepts: async () => {
    const res = await API.get("/users/friend-accepts");
    return res;
  },
  getFriends: async () => {
    const res = await API.get("/users/friends");
    return res;
  },

  editProfile: async (data) => {
    const res = await API.post("/users/edit/profile", data);
    return res;
  },
};
