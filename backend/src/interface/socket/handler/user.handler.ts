import { Server, Socket } from "socket.io";

import { ChatNotFriendUseCase } from "../../../application/use-cases/user/chat-not-friend.use-case";
import { FriendRequestUseCase } from "../../../application/use-cases/user/friend-request.use-case";
import { FriendCancelUseCase } from "../../../application/use-cases/user/friend-cancel.use-case";
import { RefuseFriendUseCase } from "../../../application/use-cases/user/refuse-friend.use-case";
import { AcceptFriendUseCase } from "../../../application/use-cases/user/accept-friend.use-case";

import { RoomRepository } from "../../../infrastructure/database/repositories/room.repository";
import { FriendShipRepository } from "../../../infrastructure/database/repositories/user.repository";

const friendShipRepo = new FriendShipRepository();
const roomRepo = new RoomRepository();

export const userSocket = (io: Server, socket: Socket) => {
  const myID: string = socket.data.user.userId;

  // chatNotFriend
  socket.on("CLIENT_SEND_CHAT", async (data) => {
    const userID = data.userID;
    try {
      const chatNotFriendUseCase = new ChatNotFriendUseCase(roomRepo);

      const roomID = await chatNotFriendUseCase.execute(myID, userID);

      socket.emit("SERVER_SEND_ROOM_NOT_FRIEND_ID", { roomID });
    } catch (error) {
      console.error(error);
    }
  });

  // friend request
  socket.on("CIENT_FRIEND_REQUEST", async (data) => {
    try {
      const friendRequestUseCase = new FriendRequestUseCase(friendShipRepo);
      await friendRequestUseCase.execute(myID, data.userID);
    } catch (error) {
      console.log(error);
    }
  });

  // friend cancel
  socket.on("CLIENT_FRIEND_CANCEL", async (data) => {
    try {

      const friendCancelUseCase = new FriendCancelUseCase(friendShipRepo);

      await friendCancelUseCase.execute(myID, data.userID);
    } catch (error) {
      console.log(error);
    }
  });

  // refuse friend
  socket.on("CLIENT_REFUSE_FRIEND", async (data) => {
    try {
      const refuseFriendUseCase = new RefuseFriendUseCase(friendShipRepo);
      await refuseFriendUseCase.execute(myID, data.userID);
    } catch (error) {
      console.log(error);
    }
  });

  // accept friend
  socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
    try {
      const acceptFriendUseCase = new AcceptFriendUseCase(roomRepo, friendShipRepo);
      await acceptFriendUseCase.execute(myID, data.userID);
    } catch (error) {
      console.error(error);
    }
  });
};
