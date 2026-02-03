import { Server, Socket } from "socket.io";
import Chat from "../../models/chat.model";
import Room from "../../models/room.model";

export const chatSocket = (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    const roomID = data.roomID;
    const newChat = new Chat({
      user_id: myID,
      content: data.content,
      room_id: roomID,
      images: data.images
    });

    await Promise.all([
      newChat.save().then(t => t.populate("user_id", "fullName avatar")),
      Room.updateOne(
        { _id: roomID },
        {
          lastMessageId: newChat._id,
          updatedAt: new Date()
        }
      )
    ]);

    io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
  })

  socket.on("CLIENT_SEND_TYPING", (data) => {
    socket.broadcast.to(data.roomID).emit("SERVER_RETURN_TYPING", data);
  });
}

