import { IFriendRequestReadRepository } from "../../ports/repositories/friendRequest.port";
import { GetFriendRequestsOutputDTO, FriendRequestOutputDTO } from "../../dtos/friend/get-friend-requests.dto";

export class GetFriendRequestsUseCase {
  constructor(
    private readonly friendRequestRepo: IFriendRequestReadRepository
  ) { }

  async execute(currentUserId: string): Promise<GetFriendRequestsOutputDTO> {
    const friendRequests = await this.friendRequestRepo.getIncomingFriendRequest(currentUserId);

    const friendRequestDTOs: FriendRequestOutputDTO[] = friendRequests.map((req) => {
      const data = req.toObject();

      return {
        id: data.id as string,
        senderId: data.senderId,
        fullName: data.senderProfile?.fullName || "",
        avatar: data.senderProfile?.avatar || "/images/default.webp",
        createdAt: data.createdAt
      };
    });

    return {
      friendRequests: friendRequestDTOs
    };
  }
}
