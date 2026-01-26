import { API } from "./api";

export const roomServiceAPI = {
  getDetail: async (roomID) => {
    const res = await API.get(`/room/detail/${roomID}`);
    return res;
  },
  create: async (data) => {
    const res = await API.post("/room/create", data);

    return res;
  },
};
