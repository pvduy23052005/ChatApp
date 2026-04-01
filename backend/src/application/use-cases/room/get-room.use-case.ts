import { IRoomReadRepository } from "../../ports/room.port";
import { RoomEntity } from "../../../domain/entities/room/room.entity";
import { IGetRoom } from "../../../domain/entities/room/room.type";

export class GetRoomUseCase {
  constructor(private readonly roomRepo: IRoomReadRepository) { }

  async execute(userID: string, status: string): Promise<IGetRoom[]> {
    if (!status || !userID) {
      throw new Error("Vui lòng cung cấp trạng thái phòng và ID người dùng");
    }

    const allowedStatus = ["accepted", "waiting"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    const rooms: RoomEntity[] = await this.roomRepo.getRoomByUserAndStatus(userID, status)

    const listRoom: IGetRoom[] = rooms.map((room: RoomEntity) => room.getRoom(userID));

    return listRoom;
  }
}
