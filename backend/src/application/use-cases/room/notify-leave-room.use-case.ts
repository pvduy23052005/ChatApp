import { IRoomRepository } from "../../../domain/interfaces/room.interface";
import { IChatWriteRepository } from "../../../domain/interfaces/chat.interface";

export class NotifyLeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly chatWriteRepo: IChatWriteRepository
  ) { }

  async execute(roomID: string, fullName: string): Promise<any> {
    const content = `${fullName} đã rời nhóm`;

    const newChat = await this.chatWriteRepo.createSystemMessage(roomID, content);

    await this.roomRepo.updateLastMessage(roomID, newChat._id);

    return {
      type: "system",
      content: content,
      room_id: roomID,
      _id: newChat._id,
      createdAt: newChat.createdAt,
    };
  }
}
