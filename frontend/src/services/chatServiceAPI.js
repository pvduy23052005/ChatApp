import { API } from "./api";

export const chatServiceAPI = {
  getRooms: async () => {
    const res = await API.get("/chat/rooms");
    return res;
  },
  getChats: async (roomID) => {
    const res = await API.get(`/chat/room/${roomID}`);
    return res;
  },
};
