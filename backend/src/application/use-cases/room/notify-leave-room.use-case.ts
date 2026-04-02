import { IRoomWriteRepository } from "../../ports/repositories/room.port";
import { IChatWriteRepository } from "../../ports/repositories/chat.port";

export class NotifyLeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomWriteRepository,
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
