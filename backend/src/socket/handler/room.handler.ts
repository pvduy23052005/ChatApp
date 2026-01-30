import { Server, Socket } from "socket.io";
import User from "../../models/user.model";
import Chat from "../../models/chat.model";
import Room from "../../models/room.model";

export const roomSocket = async (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  const admin = await User.findOne(({
    _id: myID,
    deleted: false,
  })).select("fullName");

  socket.on("CLINET_REMOVE_MEMBER", async (data) => {
    try {
      const { roomID, memberID, fullName } = data;
      const content = `${admin?.fullName} đã xóa ${fullName} khỏi nhóm `;

      socket.join(roomID);

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

  socket.on("CLINET_ADD_MEMBER", async (data) => {
    try {
      const { roomID, memberIDs, listFullNames } = data;
      const fullNames = listFullNames.join(", ");
      const content = `${admin?.fullName} thêm ${fullNames} vào nhóm.`;

      socket.join(roomID);

      const dataChat = {
        content: content,
        type: "system",
        room_id: roomID
      }
      const newChat = new Chat(dataChat);

      await Promise.all([
        newChat.save(),
        Room.updateOne(
          { _id: roomID },
          { lastMessageID: newChat._id }
        )
      ]);
      console.log(newChat);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", {
        ...dataChat,
        _id: newChat._id,
        createdAt: newChat.createdAt
      });
    } catch (error) {
      console.error("Lỗi Socket Add Member:", error);
    }

  });
}