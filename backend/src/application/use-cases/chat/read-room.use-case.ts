import { IRoomRepository } from "../../../domain/interfaces/room.interface";
import { IChatWriteRepository } from "../../../domain/interfaces/chat.interface";

export class ReadRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly chatWriteRepo: IChatWriteRepository
  ) { }

  async execute(roomID: string, userID: string): Promise<void> {
    const room = await this.roomRepo.findRoomById(roomID);

    if (room && room.lastMessageId) {
      await this.chatWriteRepo.markMessageAsRead(room.lastMessageId.toString(), userID);
    }
  }
}
