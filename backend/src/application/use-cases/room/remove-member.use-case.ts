import { IRoomRepository } from "../../../domain/interfaces/room.interface";

export class RemoveMemberUseCase {
  constructor(private readonly roomRepository: IRoomRepository) { }

  async execute(roomID: string, removeMemberID: string, myID: string) {

    if (removeMemberID === myID) {
      throw new Error("Không thể xóa chính mình khỏi nhóm");
    }

    await this.roomRepository.removeMemberFromRoom(roomID, removeMemberID);

    return removeMemberID;
  }
}
