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

  refuseFriend: (userID) => {
    if (!socket.connected) return;
    socket.emit("CLIENT_REFUSE_FRIEND", {
      userID: userID,
    });
  },

  acceptFriend: (userID) => {
    if (!socket.connected) return;
    socket.emit("CLIENT_ACCEPT_FRIEND", {
      userID: userID,
    });
  },
};
