import { IRoomRepository } from "../../../domain/interfaces/room.interface";
import { IChatRepository } from "../../../domain/interfaces/chat.interface";
import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class NotifyAssignAdminUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly chatRepo: IChatRepository,
    private readonly userRepo: IUserRepository
  ) { }

  async execute(roomID: string, adminID: string, assignedMemberFullName: string): Promise<any> {
    const adminFullName = await this.userRepo.findUserFullName(adminID);
    const content = `${adminFullName} đã phong ${assignedMemberFullName} làm quản trị viên nhóm`;

    const newChat = await this.chatRepo.createSystemMessage(roomID, content);

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
