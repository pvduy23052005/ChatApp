import { FriendEntity } from "../../../domain/friend/entity";

export interface IFriendReadRepo {
  getAll(id: string): Promise<FriendEntity[]>;
}

export interface IFriendWriteRepo {
  save(friend: FriendEntity): Promise<void>;

  update(friend: FriendEntity): Promise<void>;

  delete(friend: FriendEntity): Promise<void>;
}