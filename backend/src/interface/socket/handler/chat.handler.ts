import { Server, Socket } from "socket.io";
import { SendMessageUseCase } from "../../../application/use-cases/chat/send-message.use-case";
import { ReadRoomUseCase } from "../../../application/use-cases/chat/read-room.use-case";

import { RoomRepository } from "../../../infrastructure/database/repositories/room.repository";
import { ChatWriteRepository } from "../../../infrastructure/database/repositories/chat.repository";


const roomRepo = new RoomRepository();
const chatWriteRepo = new ChatWriteRepository();

export const chatSocket = (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    const roomID = data.roomID;
    socket.join(roomID);

    const sendMessageUseCase = new SendMessageUseCase(chatWriteRepo, roomRepo);
    const newChat = await sendMessageUseCase.execute({
      user_id: myID,
      room_id: roomID,
      content: data.content,
      images: data.images,
    });
    io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
  });

  socket.on("CLIENT_SEND_TYPING", (data) => {
    socket.join(data.roomID);
    socket.broadcast.to(data.roomID).emit("SERVER_RETURN_TYPING", data);
  });

  socket.on("CLIENT_READ_ROOM", async (data) => {
    const { roomID, userID } = data;

    try {
      const readRoomUseCase = new ReadRoomUseCase(roomRepo, chatWriteRepo);
      await readRoomUseCase.execute(roomID, userID);

      io.emit("SERVER_RETURN_UPDATE_READ_STATUS", data);
    } catch (error) {
      console.error("Error in CLIENT_READ_ROOM:", error);
    }
  });
};

