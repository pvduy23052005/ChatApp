import { IUserReadRepository } from "../../ports/user.port";
import { IOutputUserDTO } from "./get-users.use-case";

export class GetFriendAcceptsUseCase {

  constructor(private readonly userReadRepo: IUserReadRepository) {
  }

  public async execute(user: any): Promise<IOutputUserDTO[]> {

    if (!user.friendAccepts || user.friendAccepts.length === 0) {
      return [];
    }

    const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
    const users = await this.userReadRepo.findUsersInList(acceptIDs);

    return users;
  }
}
