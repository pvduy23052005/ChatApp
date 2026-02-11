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
  leaveRoom: (roomID, fullName) => {
    socket.emit("CLINET_MEMBER_LEAVE_ROOM", {
      roomID: roomID,
      fullName: fullName,
    });
  },
  assignAdmin: (roomID, fullName) => {
    socket.emit("CLIENT_ASSIGN_ADMIN", {
      roomID: roomID,
      fullName: fullName,
    });
  },
};
