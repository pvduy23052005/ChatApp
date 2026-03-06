import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class GetFriendAcceptsUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(user: any) {

    if (!user.friendAccepts || user.friendAccepts.length === 0) {
      return [];
    }

    const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
    const users = await this.userRepository.findUsersInList(acceptIDs);
    return users;
  }
}
