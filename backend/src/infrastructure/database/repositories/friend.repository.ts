import { FriendEntity } from "../../../domain/friend/entity";
import { IFriendReadRepo, IFriendWriteRepo } from "../../../application/ports/repositories/friend.port";

import Friend from "../model/friend.model";

export class FriendRepository implements IFriendReadRepo, IFriendWriteRepo {
  async getAll(id: string): Promise<FriendEntity[]> {
    const docs = await Friend.find({
      $or: [{ userId1: id }, { userId2: id }]
    }).lean();

    return docs.map((doc: any) => FriendEntity.restore({
      id: doc._id.toString(),
      userId1: doc.userId1.toString(),
      userId2: doc.userId2.toString(),
      roomId: doc.roomChatId.toString(),
      createdAt: doc.createdAt
    }));
  }
  async save(friend: FriendEntity): Promise<void> {
    const friendModel = new Friend({
      userId1: friend.getUserId1(),
      userId2: friend.getUserId2(),
      roomChatId: friend.getRoomId(),
    });

    await friendModel.save();
  }
  async update(friend: FriendEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(friend: FriendEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }
}