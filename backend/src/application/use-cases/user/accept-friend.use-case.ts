import { IRoomRepository } from "../../../domain/interfaces/room.interface";
import { IFriendShipRepository } from "../../../domain/interfaces/user.interface";

export class AcceptFriendUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly friendShipRepo: IFriendShipRepository
  ) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      let existRoom = await this.roomRepo.checkRoomExist(myID, userID);
      let roomChatId;

      if (existRoom) {
        roomChatId = existRoom._id.toString();
        await this.roomRepo.updateMemberStatus(roomChatId, "accepted");
      } else {
        const newRoom = await this.roomRepo.createNewRoom({
          typeRoom: "single",
          members: [
            { user_id: myID, status: "accepted" },
            { user_id: userID, status: "accepted" },
          ],
        });
        roomChatId = newRoom._id.toString();
      }

      await Promise.all([
        this.friendShipRepo.addFriendToList(myID, userID, roomChatId),
        this.friendShipRepo.removeFriendAccept(myID, userID),

        this.friendShipRepo.addFriendToList(userID, myID, roomChatId),
        this.friendShipRepo.removeFriendRequest(userID, myID),
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
