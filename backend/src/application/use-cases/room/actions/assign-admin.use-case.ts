import { IRoomReadRepository, IRoomWriteRepository } from "../../../ports/repositories/room.port";

export class AssignAdminUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository
  ) { }

  async execute(roomID: string, newAdminID: string, myID: string): Promise<void> {

    const room = await this.roomReadRepo.findRoomById(roomID);
    if (!room) {
      throw new Error("Phòng không tồn tại");
    }

    room.assignAdmin(newAdminID, myID);

    await this.roomWriteRepo.update(room);
  }
}
