import { IRoomWriteRepository, IRoomReadRepository } from "../../../ports/repositories/room.port";

export class AddMemberUseCase {
  constructor(
    private readonly roomWriteRepo: IRoomWriteRepository,
    private readonly roomReadRepo: IRoomReadRepository
  ) { }

  async execute(roomID: string, newMemberIDs: string | string[], requesterId: string): Promise<void> {
    const room = await this.roomReadRepo.findRoomById(roomID);

    if (!room) {
      throw new Error("Phòng không tồn tại");
    }

    const memberIDs: string[] = Array.isArray(newMemberIDs)
      ? newMemberIDs
      : [newMemberIDs];

    const existMemberIDs = room.getMembers().map(
      (member: any) => member.user_id.toString()
    );

    const filteredMemberIDs = memberIDs.filter(
      (userID: string) => !existMemberIDs.includes(userID)
    );

    if (filteredMemberIDs.length === 0) {
      throw new Error("Tất cả người dùng được chọn đã có mặt trong phòng");
    }

    filteredMemberIDs.forEach((userId: string) => {
      room.addMember(userId, requesterId);
    });

    await this.roomWriteRepo.update(room);
  }
}
