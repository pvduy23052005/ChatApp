import { IRoomReadRepository } from "../../ports/room.port";

export class IsUserInRoomUseCase {
  constructor(private readonly roomRepository: IRoomReadRepository) { }

  async execute(roomID: string, userID: string): Promise<any> {
    try {

      if (!roomID || !userID) {
        throw new Error("Vui lòng cung cấp ID phòng và ID người dùng");
      }

      const room = await this.roomRepository.findRoomWithUser(roomID, userID);

      return room;
    } catch (error) {
      console.error("Lỗi check user in room:", error);
      return false;
    }
  }
}
