import { IRoomWriteRepository } from "../../../domain/interfaces/room.interface";
import { IChatWriteRepository } from "../../../domain/interfaces/chat.interface";
import { IUserReadRepository } from "../../../domain/interfaces/user.interface";

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
