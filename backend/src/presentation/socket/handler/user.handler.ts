import { Server, Socket } from "socket.io";

import { ChatNotFriendUseCase } from "../../../application/use-cases/user/chat-not-friend.use-case";
import { FriendRequestUseCase } from "../../../application/use-cases/user/friend-request.use-case";
import { FriendCancelUseCase } from "../../../application/use-cases/user/friend-cancel.use-case";
import { RefuseFriendUseCase } from "../../../application/use-cases/user/refuse-friend.use-case";
import { AcceptFriendUseCase } from "../../../application/use-cases/user/accept-friend.use-case";

import { RoomReadRepository, RoomWriteRepository, RoomMemberRepository } from "../../../infrastructure/database/repositories/room.repository";
import { FriendShipRepository } from "../../../infrastructure/database/repositories/user.repository";
import { FriendRequestRepository } from "../../../infrastructure/database/repositories/friendRequest.repository";
import { FriendRepository } from "../../../infrastructure/database/repositories/friend.repository";

const friendRepo = new FriendRepository();
const friendRequestRepo = new FriendRequestRepository();
const friendShipRepo = new FriendShipRepository();
const roomReadRepo = new RoomReadRepository();
const roomWriteRepo = new RoomWriteRepository();
const roomMemberRepo = new RoomMemberRepository();

export const userSocket = (io: Server, socket: Socket) => {
  const myID: string = socket.data.user.userId;

  // chatNotFriend
  socket.on("CLIENT_SEND_CHAT", async (data) => {
    const userID = data.userID;
    try {
      const chatNotFriendUseCase = new ChatNotFriendUseCase(roomReadRepo, roomWriteRepo);

      const roomID = await chatNotFriendUseCase.execute(myID, userID);

      socket.emit("SERVER_SEND_ROOM_NOT_FRIEND_ID", { roomID });
    } catch (error) {
      console.error(error);
    }
  });

  // friend request
  socket.on("CIENT_FRIEND_REQUEST", async (data) => {
    try {
      const friendRequestUseCase = new FriendRequestUseCase( friendRequestRepo);
      await friendRequestUseCase.execute(myID, data.userID);
    } catch (error) {
      console.log(error);
    }
  });

  // friend cancel
  socket.on("CLIENT_FRIEND_CANCEL", async (data) => {
    try {

      const friendCancelUseCase = new FriendCancelUseCase(friendRequestRepo);

      await friendCancelUseCase.execute(myID, data.userID);
    } catch (error) {
      console.log(error);
    }
  });

  // refuse friend
  socket.on("CLIENT_REFUSE_FRIEND", async (data) => {
    try {
      const refuseFriendUseCase = new RefuseFriendUseCase(friendRequestRepo);
      await refuseFriendUseCase.execute(myID, data.userID);
    } catch (error) {
      console.log(error);
    }
  });

  // accept friend
  socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
    try {
      const acceptFriendUseCase = new AcceptFriendUseCase(roomReadRepo, roomWriteRepo, roomMemberRepo, friendRepo, friendRequestRepo);
      await acceptFriendUseCase.execute(myID, data.userID);
    } catch (error) {
      console.error(error);
    }
  });
};
