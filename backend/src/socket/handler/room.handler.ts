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

  // notify remove member 
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
      console.log(newChat);
      // save db . 
      await Promise.all([
        newChat.save(),
        Room.updateOne(
          { _id: roomID },
          { lastMessageId: newChat._id }
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

  // notify add member 
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
          { lastMessageId: newChat._id }
        )
      ]);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", {
        ...dataChat,
        _id: newChat._id,
        createdAt: newChat.createdAt
      });
    } catch (error) {
      console.error("Lỗi Socket Add Member:", error);
    }

  });

  // notify leave room . 
  socket.on("CLINET_MEMBER_LEAVE_ROOM", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const content = `${fullName} đã rời nhóm`;

      const dataChat = {
        room_id: roomID,
        content: content,
        type: "system"
      }
      const newChat = new Chat(dataChat);

      await Promise.all([
        newChat.save(),
        Room.updateOne(
          { _id: roomID },
          { lastMessageId: newChat._id })
      ])

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