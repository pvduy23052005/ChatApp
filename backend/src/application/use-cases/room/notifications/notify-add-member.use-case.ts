import { IRoomWriteRepository } from "../../../ports/repositories/room.port";
import { IChatWriteRepository } from "../../../ports/repositories/chat.port";
import { IUserReadRepository } from "../../../ports/repositories/user.port";

export class NotifyAddMemberUseCase {
  constructor(
    private readonly roomRepo: IRoomWriteRepository,
    private readonly chatRepo: IChatWriteRepository,
    private readonly userRepo: IUserReadRepository
  ) { }

  async execute(roomID: string, adminID: string, listFullNames: string[]): Promise<any> {
    const adminFullName = await this.userRepo.findUserFullName(adminID);
    const fullNamesStr = listFullNames.join(", ");
    const content = `${adminFullName} thêm ${fullNamesStr} vào nhóm.`;

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
