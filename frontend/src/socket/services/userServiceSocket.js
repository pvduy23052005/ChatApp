import { socket } from "../index";

export const userServiceSocket = {
  chatNotFriend: (data) => {
    if (!socket.connected) return;
    socket.emit("CLIENT_SEND_CHAT", data);
  },
  friendRequest: (userID) => {
    if (!socket.connected) return;
    socket.emit("CIENT_FRIEND_REQUEST", {
      userID: userID,
    });
  },
  cancelRequest: (userID) => {
    if (!socket.connected) return;
    socket.emit("CLIENT_FRIEND_CANCEL", {
      userID: userID,
    });
  },
};
