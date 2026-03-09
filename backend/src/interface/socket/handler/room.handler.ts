import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../infrastructure/database/repositories/room.repository";
import { ChatRepository } from "../../../infrastructure/database/repositories/chat.repository";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";

import { NotifyRemoveMemberUseCase } from "../../../application/use-cases/room/notify-remove-member.use-case";
import { NotifyAddMemberUseCase } from "../../../application/use-cases/room/notify-add-member.use-case";
import { NotifyLeaveRoomUseCase } from "../../../application/use-cases/room/notify-leave-room.use-case";
import { NotifyAssignAdminUseCase } from "../../../application/use-cases/room/notify-assign-admin.use-case";

const roomRepo = new RoomRepository();
const chatRepo = new ChatRepository();
const userRepo = new UserRepository();

export const roomSocket = async (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  // notify remove member 
  socket.on("CLINET_REMOVE_MEMBER", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const notifyRemoveMemberUseCase = new NotifyRemoveMemberUseCase(roomRepo, chatRepo, userRepo);
      const newChat = await notifyRemoveMemberUseCase.execute(roomID, myID, fullName);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.error("Lỗi Socket Remove Member:", error);
    }
  });

  // notify add member 
  socket.on("CLINET_ADD_MEMBER", async (data) => {
    try {
      const { roomID, listFullNames } = data;
      socket.join(roomID);

      const notifyAddMemberUseCase = new NotifyAddMemberUseCase(roomRepo, chatRepo, userRepo);
      const newChat = await notifyAddMemberUseCase.execute(roomID, myID, listFullNames);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.error("Lỗi Socket Add Member:", error);
    }
  });

  // notify leave room . 
  socket.on("CLINET_MEMBER_LEAVE_ROOM", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const notifyLeaveRoomUseCase = new NotifyLeaveRoomUseCase(roomRepo, chatRepo);
      const newChat = await notifyLeaveRoomUseCase.execute(roomID, fullName);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.error("Lỗi Socket Leave Room:", error);
    }
  });

  // notify assign admin 
  socket.on("CLIENT_ASSIGN_ADMIN", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const notifyAssignAdminUseCase = new NotifyAssignAdminUseCase(roomRepo, chatRepo, userRepo);
      const newChat = await notifyAssignAdminUseCase.execute(roomID, myID, fullName);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.log("Lỗi Socket Assign Admin:", error);
    }
  });
};
