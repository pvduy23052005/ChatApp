import { IRoomRepository } from "../../../domain/interfaces/room.interface";
import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class AcceptFriendUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository
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
        this.userRepo.addFriendToList(myID, userID, roomChatId),
        this.userRepo.removeFriendAccept(myID, userID),

        this.userRepo.addFriendToList(userID, myID, roomChatId),
        this.userRepo.removeFriendRequest(userID, myID),
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
