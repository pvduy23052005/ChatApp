import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class GetFriendsUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(user: any) {

    if (!user.friendList || user.friendList.length === 0) {
      return [];
    }

    const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
    const users = await this.userRepository.findUsersInList(friendIDs);
    return users;
  }
}
