import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/repositories/friendRequest.port";

export class RefuseFriendUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository,
  ) { }

  async execute(senderId: string, currentUserId: string): Promise<void> {

    const friendRequest = await this.friendRequestRepo.getFriendRequest(senderId, currentUserId);

    if (!friendRequest || !friendRequest.getId()) {
      throw new Error("Không tồn tại lời mời kết bạn");
    }

    if (friendRequest.getReceiverId() !== currentUserId) {
      throw new Error("Bạn không có quyền từ chối lời mời kết bạn này");
    }

    friendRequest.refuse();

    await this.friendRequestRepo.update(friendRequest);
  }
}
