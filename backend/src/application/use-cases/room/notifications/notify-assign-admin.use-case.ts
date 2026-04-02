import { IRoomWriteRepository } from "../../../ports/repositories/room.port";
import { IChatWriteRepository } from "../../../ports/repositories/chat.port";
import { IUserReadRepository } from "../../../ports/repositories/user.port";
import { ChatEntity } from "../../../../domain/chat/chat.entity";
import { INotifyOutputDTO } from "./notification.dto";

export class NotifyAssignAdminUseCase {
  constructor(
    private readonly roomRepo: IRoomWriteRepository,
    private readonly chatWriteRepo: IChatWriteRepository,
    private readonly useReadrRepo: IUserReadRepository
  ) { }

  async execute(roomID: string, adminID: string, assignedMemberFullName: string): Promise<INotifyOutputDTO> {
    const adminFullName = await this.useReadrRepo.findUserFullName(adminID);

    const content = `${adminFullName} đã phong ${assignedMemberFullName} làm quản trị viên nhóm`;

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
