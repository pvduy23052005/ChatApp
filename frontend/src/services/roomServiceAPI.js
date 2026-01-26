import { API } from "./api";

export const roomServiceAPI = {
  getDetail: async (roomID) => {
    const res = await API.get(`/room/detail/${roomID}`);
    return res;
  },
  edit : async (roomID , title) => {
    const res = await API.patch(`/room/edit/${roomID}` , {
      title: title
    });
    return res ; 
  },
  create: async (data) => {
    const res = await API.post("/room/create", data);

    return res;
  },
  delete: async (roomID) => {
    const res = await API.post(`/room/delete/${roomID}`);

    return res;
  },
  removeMember: async (roomID, memberID) => {
    const res = await API.post(`/room/remove-member/${roomID}`, {
      removeMemberID: memberID,
    });
    return res;
  },
};
