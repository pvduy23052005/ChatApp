import { API } from "./api";

export const chatServiceAPI = {
  getRooms: async () => {
    const res = await API.get("/chat/rooms");
    return res;
  },
};
