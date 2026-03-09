import { IRoomRepository } from "../../../domain/interfaces/room.interface";

export class DeleteRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) { }

  async execute(roomID: string) {

    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    await this.roomRepository.softDeleteRoom(roomID);
  }
}
