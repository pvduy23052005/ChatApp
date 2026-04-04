import { FriendRequestEntity } from "../../../domain/friendRequest/entity";


export interface IFriendRequestReadRepository {
  getIncomingFriendRequest(myID: string): Promise<FriendRequestEntity[]>;

  getOutgoingFriendRequest(myID: string): Promise<FriendRequestEntity[]>;

  getFriendRequest(senderID: string, receiverID: string): Promise<FriendRequestEntity | null>;
  findRequestById(id: string): Promise<FriendRequestEntity | null>;
}

export interface IFriendRequestWriteRepository {
  save(friendRequest: FriendRequestEntity): Promise<void>;

  update(friendRequest: FriendRequestEntity): Promise<void>;

  delete(id: string): Promise<void>;
}
