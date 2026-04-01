import { IRoomMemberRepository } from "../../ports/room.port";

export class RemoveMemberUseCase {
  constructor(private readonly roomRepository: IRoomMemberRepository) { }

  async execute(roomID: string, removeMemberID: string, myID: string) {

    if (removeMemberID === myID) {
      throw new Error("Không thể xóa chính mình khỏi nhóm");
    }

    await this.roomRepository.removeMemberFromRoom(roomID, removeMemberID);

    return removeMemberID;
  }
}
