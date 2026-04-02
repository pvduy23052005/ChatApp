import { IUserReadRepository } from "../../ports/repositories/user.port";
import { IFriendReadRepo } from "../../ports/repositories/friend.port";
import { IFriendRequestReadRepository } from "../../ports/repositories/friendRequest.port";

export interface IOutputUserDTO {
  id: string;
  fullName: string;
  avatar: string;
}

export class GetUsersUseCase {

  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly friendRepo: IFriendReadRepo,
    private readonly friendRequestRepo: IFriendRequestReadRepository
  ) { }

  public async execute(userID: string): Promise<IOutputUserDTO[]> {

    const [friends, incomingRequests, outgoingRequests] = await Promise.all([
      this.friendRepo.getAll(userID),
      this.friendRequestRepo.getIncomingFriendRequest(userID),
      this.friendRequestRepo.getOutgoingFriendRequest(userID)
    ]);

    const friendIDs: string[] = friends.map((f) =>
      f.getUserId1() === userID ? f.getUserId2() : f.getUserId1()
    );
    const acceptIDs: string[] = incomingRequests.map(req => req.getSenderId());
    const requestIDs: string[] = outgoingRequests.map(req => req.getReceiverId());

    const listId = [
      userID,
      ...friendIDs,
      ...acceptIDs,
      ...requestIDs,
    ];

    const users = await this.userReadRepo.findUsersNotInList(listId);

    return users;
  }
}
