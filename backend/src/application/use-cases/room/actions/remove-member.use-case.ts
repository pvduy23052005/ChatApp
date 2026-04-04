import { IRoomReadRepository, IRoomWriteRepository } from "../../../ports/repositories/room.port";

export class RemoveMemberUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository
  ) { }

  async execute(roomID: string, removeMemberID: string, myID: string) {

    const room = await this.roomReadRepo.findRoomById(roomID);
    if (!room) {
      throw new Error("Phòng không tồn tại");
    }

    room.removeMember(removeMemberID, myID);

    await this.roomWriteRepo.update(room);

    return removeMemberID;
  }
}
