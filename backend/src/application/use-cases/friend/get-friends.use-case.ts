import { IFriendReadRepo } from "../../ports/repositories/friend.port";
import { IUserReadRepository } from "../../ports/repositories/user.port";
import { GetFriendsOutputDTO, FriendOutputDTO } from "../../dtos/friend/get-friends.dto";

export class GetFriendsUseCase {
  constructor(
    private readonly friendRepo: IFriendReadRepo,
    private readonly userReadRepo: IUserReadRepository
  ) { }

  async execute(currentUserId: string): Promise<GetFriendsOutputDTO> {
    const friendShips = await this.friendRepo.getAll(currentUserId);

    if (friendShips.length === 0) {
      return { friends: [] };
    }

    const friendIDs: string[] = friendShips.map((f) =>
      f.getUserId1() === currentUserId ? f.getUserId2() : f.getUserId1()
    );

    const users = await this.userReadRepo.findUsersInList(friendIDs);

    const friendDTOs: FriendOutputDTO[] = users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      avatar: u.avatar || "/images/default-avatar.webp",
    }));

    return {
      friends: friendDTOs
    };
  }
}
