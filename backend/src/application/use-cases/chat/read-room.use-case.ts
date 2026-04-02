import { IRoomReadRepository } from "../../ports/repositories/room.port";
import { IChatWriteRepository, IChatReadRepository } from "../../ports/repositories/chat.port";

export class ReadRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomReadRepository,
    private readonly chatWriteRepo: IChatWriteRepository,
    private readonly chatReadRepo: IChatReadRepository
  ) { }

  async execute(roomID: string, userID: string): Promise<void> {
    const room = await this.roomRepo.findRoomById(roomID);

    if (room && room.lastMessageId) {
      const message = await this.chatReadRepo.findById(room.lastMessageId.toString());

      if (message) {
        message.markAsRead(userID);
        await this.chatWriteRepo.update(message);
      }
    }
  }
}
