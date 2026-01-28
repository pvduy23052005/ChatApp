import { Server, Socket } from "socket.io";
import User from "../../models/user.model";
import Chat from "../../models/chat.model";
import Room from "../../models/room.model";

export const roomSocket = async (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  const user = await User.findOne(({
    _id: myID,
    deleted: false,
  })).select("fullName");

  socket.on("CLINET_REMOVE_MEMBER", async (data) => {
    try {
      const { roomID, memberID, fullName } = data;
      socket.join(roomID);
      const content = `${user?.fullName} đã xóa ${fullName} khỏi nhóm `;

      const dataChat = {
        type: "system",
        content: content,
        room_id: roomID,
      }
      const newChat = new Chat(dataChat);
      // save db . 
      await Promise.all([
        newChat.save(),
        Room.updateOne(
          { _id: roomID },
          { lastMessageID: newChat._id }
        )
      ]);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", {
        ...dataChat,
        _id: newChat._id,
        createdAt: newChat.createdAt
      });
    } catch (error) {
      console.error("Lỗi Socket Remove Member:", error);
    }
  });
}