import { socket } from "../index";

export const chatServiceSocket = {
  sendMessage: (data) => {
    if (!socket.connected) return;
    socket.emit("CLIENT_SEND_MESSAGE", data);
  },
};
