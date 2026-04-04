export interface FriendOutputDTO {
  id: string;
  fullName: string;
  avatar: string;
}

export interface GetFriendsOutputDTO {
  friends: FriendOutputDTO[];
}
