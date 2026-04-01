import { IRoomReadRepository } from "../../ports/room.port";
import { IChatWriteRepository } from "../../ports/chat.port";

export class ReadRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomReadRepository,
    private readonly chatWriteRepo: IChatWriteRepository
  ) { }

  async execute(roomID: string, userID: string): Promise<void> {
    const room = await this.roomRepo.findRoomById(roomID);

    if (room && room.lastMessageId) {
      await this.chatWriteRepo.markMessageAsRead(room.lastMessageId.toString(), userID);
    }
  }
}
