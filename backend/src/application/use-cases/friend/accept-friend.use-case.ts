import { IRoomReadRepository, IRoomWriteRepository } from "../../ports/repositories/room.port";
import { RoomEntity } from "../../../domain/room/entity";
import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/repositories/friendRequest.port";
import { FriendEntity } from "../../../domain/friend/entity";
import { IFriendReadRepo, IFriendWriteRepo } from "../../ports/repositories/friend.port";

export class AcceptFriendUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository,
    private readonly friendShipRepo: IFriendReadRepo & IFriendWriteRepo,
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository,
  ) { }

  async execute(senderId: string, currentUserId: string): Promise<void> {

    const friendRequest = await this.friendRequestRepo.findRequestById(senderId);

    if (!friendRequest) {
      throw new Error("Không tồn tại lời mời kết bạn");
    }

    if (friendRequest.getReceiverId() !== currentUserId) {
      throw new Error("Bạn không có quyền chấp nhận lời mời kết bạn này");
    }

    const id = friendRequest.getSenderId();

    const existRoom = await this.roomReadRepo.checkRoomExist(currentUserId, id);
    let roomChatId: string;

    if (existRoom) {
      roomChatId = existRoom.getId();
      existRoom.acceptAllMembers();
      await this.roomWriteRepo.update(existRoom);
    } else {
      const roomEntity = RoomEntity.createFriendRoom(currentUserId, id);
      const newRoom = await this.roomWriteRepo.createNewRoom(roomEntity);
      roomChatId = newRoom.getId();
    }

    friendRequest.accept();
    const friend = FriendEntity.establish(currentUserId, id, roomChatId);

    await Promise.all([
      this.friendRequestRepo.update(friendRequest),
      this.friendShipRepo.save(friend),
    ]);
  }
}
