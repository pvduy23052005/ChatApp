import { IFriendShipRepository } from "../../../domain/interfaces/user.interface";

export class FriendRequestUseCase {
  constructor(private readonly friendShipRepo: IFriendShipRepository) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      await Promise.all([
        this.friendShipRepo.addFriendRequest(myID, userID),
        this.friendShipRepo.addFriendAccept(userID, myID),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
