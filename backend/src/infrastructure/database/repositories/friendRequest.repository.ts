import { IFriendRequestReadRepository, IFriendRequestWriteRepository } from "../../../application/ports/repositories/friendRequest.port";
import { FriendRequestEntity } from "../../../domain/friendRequest/entity";
import FriendRequest from "../model/friendRequest.model";

export class FriendRequestRepository implements IFriendRequestReadRepository, IFriendRequestWriteRepository {

  async getIncomingFriendRequest(myID: string): Promise<FriendRequestEntity[]> {

    const users = await FriendRequest.find({
      receiverId: myID,
      status: "pending"
    })
      .populate("senderId", "fullName avatar")
      .lean();

    return users.map((req: any) => {
      const senderInfo = req.senderId as any;

      return FriendRequestEntity.restore({
        id: req._id.toString(),
        senderId: senderInfo._id.toString(),
        receiverId: req.receiverId.toString(),
        status: req.status,
        senderProfile: {
          fullName: senderInfo.fullName,
          avatar: senderInfo.avatar || "/images/default.webp",
        },
        createdAt: req.createdAt
      });
    });
  }

  async getOutgoingFriendRequest(myID: string): Promise<FriendRequestEntity[]> {
    const docs = await FriendRequest.find({
      senderId: myID,
      status: "pending"
    }).lean();

    return docs.map((doc: any) => {
      return FriendRequestEntity.restore({
        id: doc._id.toString(),
        senderId: doc.senderId.toString(),
        receiverId: doc.receiverId.toString(),
        status: doc.status,
        createdAt: doc.createdAt
      });
    });
  }

  async getFriendRequest(myId: string, friendId: string): Promise<FriendRequestEntity | null> {
    const doc = await FriendRequest.findOne({
      receiverId: myId,
      senderId: friendId,
      status: "pending"
    }).lean();

    if (!doc) return null;

    return FriendRequestEntity.restore({
      id: doc._id.toString(),
      senderId: doc.senderId.toString(),
      receiverId: doc.receiverId.toString(),
      status: doc.status,
      createdAt: doc.createdAt
    });
  }

  async save(friendRequest: FriendRequestEntity): Promise<void> {

    const friendRequestModel = new FriendRequest({
      senderId: friendRequest.getSenderId(),
      receiverId: friendRequest.getReceiverId(),
      status: friendRequest.getStatus()
    });
    await friendRequestModel.save();
  }

  async update(friendRequest: FriendRequestEntity): Promise<void> {
    const { id, ...data } = friendRequest.toObject();

    await FriendRequest.updateOne(
      { _id: id },
      data
    );
  }

  async delete(id: string): Promise<void> {
    await FriendRequest.deleteOne({ _id: id });
  }
}