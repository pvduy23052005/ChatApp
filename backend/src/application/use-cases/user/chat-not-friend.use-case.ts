import { IRoomReadRepository, IRoomWriteRepository } from "../../ports/repositories/room.port";

export class ChatNotFriendUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository
  ) { }

  async execute(myID: string, userID: string): Promise<string> {
    const existRoom = await this.roomReadRepo.checkRoomExist(myID, userID);

    if (existRoom) {
      return existRoom._id.toString();
    } else {
      const newRoom = await this.roomWriteRepo.createNewRoom({
        typeRoom: "single",
        members: [
          { user_id: myID, role: "member", status: "waiting" },
          { user_id: userID, role: "member", status: "waiting" },
        ],
      });
      return newRoom._id.toString();
    }
  }
}
