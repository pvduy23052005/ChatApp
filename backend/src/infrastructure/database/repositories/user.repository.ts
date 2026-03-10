import User from "../model/user.model";
import { IUserReadRepository, IUserWriteRepository, IFriendShipRepository } from "../../../domain/interfaces/user.interface";
import { UserEntity } from "../../../domain/entities/user.entity";

const mapToEntity = (doc: any) => {

  if (!doc) return null;

  return new UserEntity(
    doc._id,
    doc.fullName,
    doc.email,
    doc.password,
    doc.avatar,
    doc.statusOnline,
    doc.createdAt,
    doc.updatedAt
  );
}

export class UserReadRepository implements IUserReadRepository {

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    return mapToEntity(user);
  }

  public async findUserById(userID: string): Promise<UserEntity | null> {
    const user = await User.findOne({ _id: userID, deleted: false });
    return mapToEntity(user);
  }

  public async findUsersNotInList(listId: string[]): Promise<any[]> {
    return await User.find({ _id: { $nin: listId }, deleted: false }).select("fullName avatar");
  }

  public async findUsersInList(listId: string[]): Promise<any[]> {
    return await User.find({ _id: { $in: listId }, deleted: false }).select("fullName avatar");
  }

  public async findFriendNotInRoom(friendIDs: string[], memberIDs: string[]): Promise<any[]> {
    const friends = await User.find(
      {
        _id: { $in: friendIDs, $nin: memberIDs },
        deleted: false
      }).select("fullName avatar");

    return friends;
  }

  public async findUserFullName(userID: string): Promise<string | undefined> {
    const user = await User.findOne({ _id: userID, deleted: false }).select("fullName").lean();
    return user?.fullName;
  }

}

export class UserWriteRepository implements IUserWriteRepository {

  public async updateUserStatus(userID: string, status: string): Promise<any> {
    return await User.updateOne({ _id: userID }, { statusOnline: status });
  }

  public async createUser(fullName: string, email: string, password: string): Promise<UserEntity | null> {
    const userObject = {
      fullName: fullName,
      email: email,
      password: password,
      statusOffline: "offline",
    };

    const newUser = new User(userObject);
    const savedUser = await newUser.save();
    return mapToEntity(savedUser);
  }

  public async updateProfile(userID: string, dataUpdate: any): Promise<any> {
    const user = await User.findByIdAndUpdate(userID, dataUpdate, { new: true }).select("-password");
    return user;
  }
}

export class FriendShipRepository implements IFriendShipRepository {

  public async addFriendRequest(myID: string, friendID: string): Promise<void> {
    await User.updateOne({ _id: myID }, { $addToSet: { friendRequests: friendID } });
  }

  public async addFriendAccept(myID: string, friendID: string): Promise<void> {
    await User.updateOne({ _id: myID }, { $addToSet: { friendAccepts: friendID } });
  }

  public async removeFriendRequest(myID: string, friendID: string): Promise<void> {
    await User.updateOne({ _id: myID }, { $pull: { friendRequests: friendID } });
  }

  public async removeFriendAccept(myID: string, friendID: string): Promise<void> {
    await User.updateOne({ _id: myID }, { $pull: { friendAccepts: friendID } });
  }

  public async addFriendToList(myID: string, friendID: string, roomChatId: string): Promise<void> {
    await User.updateOne(
      { _id: myID },
      {
        $addToSet: {
          friendList: { user_id: friendID, room_chat_id: roomChatId },
        }
      }
    );  
  }
}
