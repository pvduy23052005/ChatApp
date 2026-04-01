import { IUserReadRepository } from "../../ports/user.port";

export class GetUsersUseCase {

  constructor(private readonly userReadRepo: IUserReadRepository) {
  }

  public async execute(user: any) {

    const myID = user.id.toString();
    const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
    const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
    const requestIDs: string[] = user.friendRequests.map((item: any) => item.toString());

    const listId = [
      myID,
      ...friendIDs,
      ...acceptIDs,
      ...requestIDs,
    ];

    const users = await this.userReadRepo.findUsersNotInList(listId);

    return users;
  }
}
