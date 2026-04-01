import { IUserReadRepository } from "../../ports/user.port";

export class GetFriendsUseCase {

  constructor(private readonly userReadRepo: IUserReadRepository) {
  }

  public async execute(user: any) {

    if (!user.friendList || user.friendList.length === 0) {
      return [];
    }

    const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
    const users = await this.userReadRepo.findUsersInList(friendIDs);
    return users;
  }
}
