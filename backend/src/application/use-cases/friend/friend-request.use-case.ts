import { FriendRequestEntity } from "../../../domain/friendRequest/entity";
import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../ports/repositories/friendRequest.port";

export class FriendRequestUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository & IFriendRequestWriteRepository,
  ) { }

  async execute(senderId: string, receiverId: string): Promise<void> {

    const isExists = await this.friendRequestRepo.getFriendRequest(senderId, receiverId);

    if (isExists) {
      throw new Error("Đã tồn tại lời mời kết bạn");
    }

    const friendRequest = FriendRequestEntity.sendNewRequest(senderId, receiverId);

    await this.friendRequestRepo.save(friendRequest);
  }
}
