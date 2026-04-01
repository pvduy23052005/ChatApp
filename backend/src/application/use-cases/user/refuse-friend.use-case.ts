import { IFriendShipRepository } from "../../ports/user.port";

export class RefuseFriendUseCase {
  constructor(
    private readonly friendShipRepo: IFriendShipRepository
  ) { }
  async execute(myID: string, userID: string): Promise<void> {
    try {
      await Promise.all([
        this.friendShipRepo.removeFriendAccept(myID, userID),
        this.friendShipRepo.removeFriendRequest(userID, myID),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
