import { IRoomReadRepository, IRoomWriteRepository } from "../../../ports/repositories/room.port";

export class LeaveRoomUseCase {
  constructor(
    private readonly roomReadRepository: IRoomReadRepository,
    private readonly roomWriteRepository: IRoomWriteRepository
  ) { }

  async execute(roomID: string, myID: string): Promise<void> {
    const room = await this.roomReadRepository.findRoomById(roomID);

    if (!room) {
      throw new Error("Phòng không tồn tại");
    }

    room.leaveRoom(myID);

    await this.roomWriteRepository.update(room);
  }
}
