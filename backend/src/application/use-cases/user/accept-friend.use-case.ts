import { IRoomReadRepository, IRoomWriteRepository, IRoomMemberRepository } from "../../ports/repositories/room.port";
import { RoomEntity } from "../../../domain/room/entity";
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
    const existRoom = await this.roomReadRepo.checkRoomExist(myID, userID);
    let roomChatId: string;

    if (existRoom) {
      roomChatId = existRoom.getId();
      existRoom.acceptAllMembers();
      await this.roomWriteRepo.update(existRoom);
    } else {
      const roomEntity = RoomEntity.createFriendRoom(myID, userID);
      const newRoom = await this.roomWriteRepo.createNewRoom(roomEntity);
      roomChatId = newRoom.getId();
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
