import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/repositories/friendRequest.port";

export class FriendCancelUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository
  ) { }

  async execute(senderId: string, receiverId: string): Promise<void> {

    const friendRequest = await this.friendRequestRepo.getFriendRequest(senderId, receiverId);

    if (!friendRequest || !friendRequest.getId()) {
      throw new Error("Không tồn tại lời mời kết bạn");
    }

    if (friendRequest.getSenderId() !== senderId) {
      throw new Error("Bạn không có quyền hủy lời mời kết bạn này");
    }

    await this.friendRequestRepo.delete(friendRequest.getId() as string);
  }
}
