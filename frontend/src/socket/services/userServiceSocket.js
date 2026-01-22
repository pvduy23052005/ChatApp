import { socket } from "../index";

export const userServiceSocket = {
  chatNotFriend: (data) => {
    if (!socket.connected) return;
    socket.emit("CLIENT_SEND_CHAT", data);
  },
};
