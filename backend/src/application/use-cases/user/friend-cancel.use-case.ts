import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class FriendCancelUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      await Promise.all([
        this.userRepo.removeFriendRequest(myID, userID),
        this.userRepo.removeFriendAccept(userID, myID),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
