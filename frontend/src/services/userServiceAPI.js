import { API } from "./api";

export const userServiceAPI = {
  getUsers: async () => {
    const res = await API.get("/users");
    return res;
  },
  getUserAccepts: async () => {
    const res = await API.get("/users/friend-accept");
    return res;
  },
};
