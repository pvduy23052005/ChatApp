import { IRoomReadRepository, IRoomWriteRepository, IRoomMemberRepository } from "../../ports/room.port";
import { IFriendShipRepository } from "../../ports/user.port";

export class AcceptFriendUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository,
    private readonly roomMemberRepo: IRoomMemberRepository,
    private readonly friendShipRepo: IFriendShipRepository
  ) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      let existRoom = await this.roomReadRepo.checkRoomExist(myID, userID);
      let roomChatId;

      if (existRoom) {
        roomChatId = existRoom._id.toString();
        await this.roomMemberRepo.updateMemberStatus(roomChatId, "accepted");
      } else {
        const newRoom = await this.roomWriteRepo.createNewRoom({
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
