import { IRoomReadRepository, IRoomWriteRepository, IRoomMemberRepository } from "../../ports/repositories/room.port";
import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/repositories/friendRequest.port";
import { FriendEntity } from "../../../domain/friend/entity";
import { IFriendReadRepo, IFriendWriteRepo } from "../../ports/repositories/friend.port";
export class AcceptFriendUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository,
    private readonly roomMemberRepo: IRoomMemberRepository,
    private readonly friendShipRepo: IFriendReadRepo & IFriendWriteRepo,
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository,
  ) { }

  async execute(myID: string, userID: string): Promise<void> {
    let existRoom = await this.roomReadRepo.checkRoomExist(myID, userID);
    let roomChatId;

    if (existRoom) {
      roomChatId = existRoom._id.toString();
      await this.roomMemberRepo.updateMemberStatus(roomChatId, "accepted");
    } else {
      const newRoom = await this.roomWriteRepo.createNewRoom({
        typeRoom: "single",
        members: [
          { user_id: myID, status: "accepted" },
          { user_id: userID, status: "accepted" },
        ],
      });
      roomChatId = newRoom._id.toString();
    }

    const friendRequest = await this.friendRequestRepo.getFriendRequest(myID, userID);

    if (!friendRequest) {
      throw new Error("Không tồn tại lời mời kết bạn");
    }
    friendRequest.accept();

    const friend = FriendEntity.establish(myID, userID, roomChatId);

    await Promise.all([
      this.friendRequestRepo.update(friendRequest),
      this.friendShipRepo.save(friend),
    ])
  }
} 
