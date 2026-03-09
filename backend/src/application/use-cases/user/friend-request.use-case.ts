import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class FriendRequestUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      await Promise.all([
        this.userRepo.addFriendRequest(myID, userID),
        this.userRepo.addFriendAccept(userID, myID),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
