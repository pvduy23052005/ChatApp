import { IUserReadRepository } from "../../ports/user.port";

export class GetFriendAcceptsUseCase {

  constructor(private readonly userReadRepo: IUserReadRepository) {
  }

  public async execute(user: any) {

    if (!user.friendAccepts || user.friendAccepts.length === 0) {
      return [];
    }

    const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
    const users = await this.userReadRepo.findUsersInList(acceptIDs);
    return users;
  }
}
