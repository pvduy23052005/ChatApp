import { IRoomReadRepository, IRoomWriteRepository } from "../../../ports/repositories/room.port";

export class EditRoomUseCase {
  constructor(
    private readonly roomWriteRepository: IRoomWriteRepository,
    private readonly roomReadRepository: IRoomReadRepository
  ) { }

  async execute(roomID: string, title: string, myID: string) {

    if (!title || title.trim() === "") {
      throw new Error("Tên phòng không được để trống!");
    }

    const room = await this.roomReadRepository.findRoomById(roomID);

    if (!room) {
      throw new Error("Không tìm thấy phòng");
    }

    room.changeTitle(title, myID);

    await this.roomWriteRepository.update(room);


    return {
      _id: roomID,
      title: title
    };
  }
}
