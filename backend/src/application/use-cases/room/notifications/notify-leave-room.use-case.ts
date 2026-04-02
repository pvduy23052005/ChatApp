import { IRoomWriteRepository } from "../../../ports/repositories/room.port";
import { IChatWriteRepository } from "../../../ports/repositories/chat.port";
import { ChatEntity } from "../../../../domain/chat/chat.entity";
import { INotifyOutputDTO } from "./notification.dto";

export class NotifyLeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomWriteRepository,
    private readonly chatWriteRepo: IChatWriteRepository
  ) { }

  async execute(roomID: string, fullName: string): Promise<INotifyOutputDTO> {
    const content = `${fullName} đã rời nhóm`;

    const systemChat = ChatEntity.createSystemMessage(roomID, content);
    const newChat = await this.chatWriteRepo.create(systemChat);

    if (newChat && newChat.getId()) {
      await this.roomRepo.updateLastMessage(roomID, newChat.getId());
    }

    return {
      type: "system",
      content: content,
      room_id: roomID,
      id: newChat?.getId(),
      readBy: newChat?.getReadBy() || [],
      createdAt: newChat?.getCreatedAt(),
    };
  }
}
