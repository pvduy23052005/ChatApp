import { socket } from "../index";

export const roomServiceSocket = {
  removeMember: (roomID, memberID, fullName) => {
    console.log(roomID);
    socket.emit("CLINET_REMOVE_MEMBER", {
      roomID: roomID,
      memberID: memberID,
      fullName: fullName,
    });
  },
};
