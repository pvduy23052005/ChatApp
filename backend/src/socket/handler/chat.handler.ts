import { Server, Socket } from "socket.io";
import Chat from "../../models/chat.model";

export const chatSocket = (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  socket.on("CLIENT_SEND_MESSAGE", async (data) => {

    const newChat = new Chat({
      user_id: myID,
      content: data.content,
      senderID: myID
    });

    await newChat.save();
    await newChat.populate("user_id" , "fullName avatar");

    io.emit("SERVER_RETURN_MESSAGE", newChat);
  })
}

