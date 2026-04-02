import { IRoomWriteRepository } from "../../../ports/repositories/room.port";
import { IChatWriteRepository } from "../../../ports/repositories/chat.port";
import { IUserReadRepository } from "../../../ports/repositories/user.port";

export class NotifyAssignAdminUseCase {
  constructor(
    private readonly roomRepo: IRoomWriteRepository,
    private readonly chatWriteRepo: IChatWriteRepository,
    private readonly useReadrRepo: IUserReadRepository
  ) { }

  async execute(roomID: string, adminID: string, assignedMemberFullName: string): Promise<any> {
    const adminFullName = await this.useReadrRepo.findUserFullName(adminID);

    const content = `${adminFullName} đã phong ${assignedMemberFullName} làm quản trị viên nhóm`;

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
