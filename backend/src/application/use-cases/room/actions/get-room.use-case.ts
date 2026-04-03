import { IRoomReadRepository } from "../../../ports/repositories/room.port";
import { GetRoomOutputDTO } from "../../../dtos/room/get-room.dto";

export class GetRoomUseCase {
  constructor(private readonly roomRepo: IRoomReadRepository) { }

  async execute(userID: string, status: string): Promise<GetRoomOutputDTO[]> {
    if (!status || !userID) {
      throw new Error("Vui lòng cung cấp trạng thái phòng và ID người dùng");
    }

    const allowedStatus = ["accepted", "waiting"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    return await this.roomRepo.getRoomByUserAndStatus(userID, status);
  }
}
