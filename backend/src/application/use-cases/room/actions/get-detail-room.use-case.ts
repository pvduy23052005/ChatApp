import { IRoomReadRepository } from "../../../ports/repositories/room.port";
import { RoomDetailOutputDTO } from "../../../dtos/room/get-detail-room.dto";

export class GetDetailRoomUseCase {
  constructor(
    private readonly roomRepository: IRoomReadRepository
  ) { }

  async execute(roomID: string): Promise<RoomDetailOutputDTO> {

    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    const detailDto = await this.roomRepository.getDetailById(roomID);

    if (!detailDto) {
      throw new Error("Phòng không tồn tại");
    }

    return detailDto;
  }
}
