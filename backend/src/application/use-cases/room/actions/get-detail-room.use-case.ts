import { IRoomReadRepository } from "../../../ports/repositories/room.port";
import { RoomDetailOutputDTO } from "../../../dtos/room/get-detail-room.dto";
import { RoomQueryMapper } from "../../../../presentation/mappers/room.mapper";

export class GetDetailRoomUseCase {
  constructor(
    private readonly roomRepository: IRoomReadRepository
  ) { }

  async execute(roomID: string): Promise<RoomDetailOutputDTO> {

    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    const roomEntity = await this.roomRepository.findRoomById(roomID);

    if (!roomEntity) {
      throw new Error("Phòng không tồn tại");
    }

    return RoomQueryMapper.toDetailDTO(roomEntity.toObject());
  }
}
