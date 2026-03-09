import { IRoomRepository } from "../../../domain/interfaces/room.interface";

export class ChatNotFriendUseCase {
  constructor(private readonly roomRepo: IRoomRepository) { }

  async execute(myID: string, userID: string): Promise<string> {
    const existRoom = await this.roomRepo.checkRoomExist(myID, userID);

    if (existRoom) {
      return existRoom._id.toString();
    } else {
      const newRoom = await this.roomRepo.createNewRoom({
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
