import { IRoomWriteRepository } from "../../../domain/interfaces/room.interface";

export class EditRoomUseCase {
  constructor(private readonly roomRepository: IRoomWriteRepository) { }

  async execute(roomID: string, title: string) {

    if (!title || title.trim() === "") {
      throw new Error("Tên phòng không được để trống!");
    }

    const trimmedTitle = title.trim();

    await this.roomRepository.updateRoomTitle(roomID, trimmedTitle);

    return {
      _id: roomID,
      title: trimmedTitle
    };
  }
}
