import { IRoomWriteRepository } from "../../../ports/repositories/room.port";
import { IChatWriteRepository } from "../../../ports/repositories/chat.port";
import { IUserReadRepository } from "../../../ports/repositories/user.port";
import { ChatEntity } from "../../../../domain/chat/chat.entity";
import { INotifyOutputDTO } from "./notification.dto";

export class NotifyRemoveMemberUseCase {
  constructor(
    private readonly roomRepo: IRoomWriteRepository,
    private readonly chatRepo: IChatWriteRepository,
    private readonly userRepo: IUserReadRepository
  ) { }

  async execute(roomID: string, adminID: string, removedMemberFullName: string): Promise<INotifyOutputDTO> {
    const adminFullName = await this.userRepo.findUserFullName(adminID);
    const content = `${adminFullName} đã xóa ${removedMemberFullName} khỏi nhóm`;

    const systemChat = ChatEntity.createSystemMessage(roomID, content);
    const newChat = await this.chatRepo.create(systemChat);

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
