import { IUserReadRepository } from "../../ports/user.port";
import { IFriendRequestReadRepository } from "../../ports/friendRequest.port";
import { IOutputUserDTO } from "./get-users.use-case";

export class GetFriendAcceptsUseCase {

  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly friendRequestRepo: IFriendRequestReadRepository
  ) {}

  public async execute(userID: string): Promise<IOutputUserDTO[]> {
    const requests = await this.friendRequestRepo.getIncomingFriendRequest(userID);

    if (requests.length === 0) {
      return [];
    }

    const acceptIDs: string[] = requests.map(req => req.getSenderId());
    const users = await this.userReadRepo.findUsersInList(acceptIDs);

    return users;
  }
}
