import { IUserReadRepository } from "../../ports/user.port";
import { IFriendReadRepo } from "../../ports/friend.port";
import { IOutputUserDTO } from "./get-users.use-case";

export class GetFriendsUseCase {

  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly friendRepo: IFriendReadRepo
  ) {}

  public async execute(userID: string): Promise<IOutputUserDTO[]> {
    const friends = await this.friendRepo.getAll(userID);
    
    if (friends.length === 0) {
      return [];
    }

    const friendIDs: string[] = friends.map((f) => 
      f.getUserId1() === userID ? f.getUserId2() : f.getUserId1()
    );
    const users = await this.userReadRepo.findUsersInList(friendIDs);
    
    return users;
  }
}
