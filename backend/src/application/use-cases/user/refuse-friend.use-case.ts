import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/friendRequest.port";

export class RefuseFriendUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository,
  ) { }

  async execute(myID: string, userID: string): Promise<void> {

    const friendRequest = await this.friendRequestRepo.getFriendRequest(myID, userID);

    if (!friendRequest || !friendRequest.getId()) {
      throw new Error("Không tồn tại lời mời kết bạn");
    }

    await this.friendRequestRepo.delete(friendRequest.getId() as string);
  }
}
