export interface FriendRequestOutputDTO {
  id: string;
  senderId: string;
  fullName: string;
  avatar: string;
  createdAt: Date;
}

export interface GetFriendRequestsOutputDTO {
  friendRequests: FriendRequestOutputDTO[];
}
