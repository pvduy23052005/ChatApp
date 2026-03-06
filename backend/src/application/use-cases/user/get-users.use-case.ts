import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class GetUsersUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
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

    const users = await this.userRepository.findUsersNotInList(listId);

    return users;
  }
}
