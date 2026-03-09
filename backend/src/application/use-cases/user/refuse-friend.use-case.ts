import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class RefuseFriendUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(myID: string, userID: string): Promise<void> {
    try {
      await Promise.all([
        this.userRepo.removeFriendAccept(myID, userID),
        this.userRepo.removeFriendRequest(userID, myID),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
