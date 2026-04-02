import { IRoomMemberRepository } from "../../../ports/repositories/room.port";

export class LeaveRoomUseCase {
  constructor(private readonly roomRepository: IRoomMemberRepository) { }

  async execute(roomID: string, myID: string, room: any) {

    const myInfo = room.members.find(
      (member: any) => member.user_id.toString() === myID
    );

    if (myInfo && myInfo.role === "superAdmin") {
      throw new Error("Vui lòng chỉ định người khác làm Trưởng nhóm trước khi rời");
    }

    await this.roomRepository.removeMemberFromRoom(roomID, myID);
  }
}
