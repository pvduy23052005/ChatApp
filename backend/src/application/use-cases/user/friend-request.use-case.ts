import { FriendRequestEntity } from "../../../domain/friendRequest/entity";
import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/friendRequest.port";

export class FriendRequestUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository,
  ) { }

  async execute(myID: string, userID: string): Promise<void> {

    const isExists = await this.friendRequestRepo.getFriendRequest(myID, userID);

    if (isExists) {
      throw new Error("Đã tồn tại lời mời kết bạn");
    }

    const friendRequest = FriendRequestEntity.sendNewRequest(myID, userID);

    await this.friendRequestRepo.save(friendRequest);
  }
}
