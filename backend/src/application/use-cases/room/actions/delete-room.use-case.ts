import { IRoomWriteRepository, IRoomReadRepository } from "../../../ports/repositories/room.port";

export class DeleteRoomUseCase {
  constructor(
    private readonly roomRepository: IRoomWriteRepository,
    private readonly roomReadRepository: IRoomReadRepository
  ) { }

  async execute(roomID: string): Promise<void> {

    const room = await this.roomReadRepository.findRoomById(roomID);
    if (!room) {
      throw new Error("Phòng không tồn tại");
    }

    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    await this.roomRepository.softDeleteRoom(roomID);
  }
}
