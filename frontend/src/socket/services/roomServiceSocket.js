import { socket } from "../index";

export const roomServiceSocket = {
  removeMember: (roomID, memberID, fullName) => {
    socket.emit("CLINET_REMOVE_MEMBER", {
      roomID: roomID,
      memberID: memberID,
      fullName: fullName,
    });
  },
  addMembers: (roomID, memberIDs, listFullNames) => {
    socket.emit("CLINET_ADD_MEMBER", {
      roomID: roomID,
      memberIDs: memberIDs,
      listFullNames: listFullNames,
    });
  },
};
