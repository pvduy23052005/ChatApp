import { API } from "./api";

export const chatServiceAPI = {
  getRoomAcceptes: async () => {
    const res = await API.get("/chat/rooms?status=accepted");
    return res;
  },
  getRoomWaitings: async () => {
    const res = await API.get("/chat/rooms?status=waiting");
    return res;
  },
  getChats: async (roomID) => {
    const res = await API.get(`/chat/room/${roomID}`);
    return res;
  },
};
