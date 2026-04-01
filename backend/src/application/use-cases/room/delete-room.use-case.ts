import { IRoomWriteRepository } from "../../ports/room.port";

export class DeleteRoomUseCase {
  constructor(private readonly roomRepository: IRoomWriteRepository) { }

  async execute(roomID: string) {

    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    await this.roomRepository.softDeleteRoom(roomID);
  }
}
