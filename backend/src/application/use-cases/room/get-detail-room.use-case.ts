import { IRoomReadRepository } from "../../../domain/interfaces/room.interface";
import { IUserReadRepository } from "../../../domain/interfaces/user.interface";

export class GetDetailRoomUseCase {
  constructor(
    private readonly roomRepository: IRoomReadRepository,
    private readonly userRepository: IUserReadRepository
  ) { }

  async execute(roomID: string, user: any) {

    if (!roomID || !user) {
      throw new Error("Vui lòng cung cấp ID phòng và ID người dùng");
    }

    const existRoom = await this.roomRepository.findRoomById(roomID);

    if (!existRoom) {
      throw new Error("Phòng không tồn tại");
    }

    const memberIDs = existRoom.members.map(
      (member: any) => member.user_id._id.toString());

    const friendIDs = user?.friendList?.map(
      (user: any) => user.user_id.toString()
    ) || [];

    const friends = await this.userRepository.findFriendNotInRoom(friendIDs, memberIDs);

    return {
      detailRoom: existRoom,
      friends: friends
    }
  }
}
