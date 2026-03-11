import { IRoomMemberRepository } from "../../../domain/interfaces/room.interface";

export class AssignAdminUseCase {
  constructor(private readonly roomRepository: IRoomMemberRepository) { }

  async execute(roomID: string, newAdminID: string, myID: string) {

    if (!newAdminID) {
      throw new Error("Vui lòng chọn thành viên để chỉ định làm quản trị viên");
    }

    if (newAdminID === myID) {
      throw new Error("Bạn đã là quản trị viên của phòng");
    }

    await this.roomRepository.assignAdminRole(roomID, newAdminID);
  }
}
