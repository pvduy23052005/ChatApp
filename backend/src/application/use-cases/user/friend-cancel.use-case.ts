import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/repositories/friendRequest.port";

export class FriendCancelUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository
  ) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      const friendRequest = await this.friendRequestRepo.getFriendRequest(userID, myID);

      if (!friendRequest || !friendRequest.getId()) {
        throw new Error("Không tồn tại lời mời kết bạn");
      }

      await this.friendRequestRepo.delete(friendRequest.getId() as string);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

