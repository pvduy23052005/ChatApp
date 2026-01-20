import { Server, Socket } from "socket.io";


export const chatSocket = (io: Server, socket: Socket) => {
  console.log(socket.data.user.userId);

  socket.on("CLIENT_SEND_MESSAGE", (data) => {
    console.log(data);
  })
}

