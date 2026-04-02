import { IRoomReadRepository } from "../../../ports/repositories/room.port";
import { IUserReadRepository } from "../../../ports/repositories/user.port";
import { IFriendReadRepo } from "../../../ports/repositories/friend.port";

export class GetDetailRoomUseCase {
  constructor(
    private readonly roomRepository: IRoomReadRepository,
    private readonly userRepository: IUserReadRepository,
    private readonly friendRepository: IFriendReadRepo
  ) { }

  async execute(roomID: string, user: any) {

    if (!roomID || !user) {
      throw new Error("Vui lòng cung cấp ID phòng và ID người dùng");
    }

    const existRoom = await this.roomRepository.findRoomById(roomID);

    if (!existRoom) {
      throw new Error("Phòng không tồn tại");
    }

    const memberIDs = existRoom.members
      .filter((member: any) => member?.user_id?._id)
      .map((member: any) => member.user_id._id.toString());

    const friendsEntities = await this.friendRepository.getAll(user.id);
    const friendIDs = friendsEntities.map((f: any) =>
      f.getUserId1() === user.id ? f.getUserId2() : f.getUserId1()
    );

    const friends = await this.userRepository.findFriendNotInRoom(friendIDs, memberIDs);

    const mappedRoom = {
      ...existRoom,
      id: (existRoom as any)._id?.toString(),
      members: existRoom.members
        .filter((m: any) => m?.user_id?._id)
        .map((m: any) => ({
          ...m,
          user_id: {
            id: m.user_id._id.toString(),
            fullName: m.user_id.fullName,
            avatar: m.user_id.avatar,
          }
        }))
    };

    return {
      detailRoom: mappedRoom,
      friends: friends
    }
  }
}
