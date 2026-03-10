import { IFriendShipRepository } from "../../../domain/interfaces/user.interface";

export class FriendCancelUseCase {
  constructor(private readonly friendShipRepo: IFriendShipRepository) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      await Promise.all([
        this.friendShipRepo.removeFriendRequest(myID, userID),
        this.friendShipRepo.removeFriendAccept(userID, myID),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
