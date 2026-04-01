import User from "../model/user.model";
import { IUserReadRepository, IUserWriteRepository, IFriendShipRepository } from "../../../application/ports/user.port";
import { UserEntity } from "../../../domain/entities/user/user.entity";
import type { IOutputUserDTO } from "../../../application/use-cases/user/get-users.use-case";

const mapToEntity = (doc: any): UserEntity | null => {
  if (!doc) return null;

  return UserEntity.restore(doc);
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

  public async findUsersNotInList(listId: string[]): Promise<IOutputUserDTO[]> {
    const users = await User.find({ _id: { $nin: listId }, deleted: false }).select("fullName avatar").lean();
    return users.map((user) => {
      return {
        id: user._id.toString(),
        fullName: user.fullName,
        avatar: user.avatar,
      };
    });
  }

  public async findUsersInList(listId: string[]): Promise<IOutputUserDTO[]> {
    const users = await User.find({ _id: { $in: listId }, deleted: false }).select("fullName avatar").lean();
    return users.map((user) => {
      return {
        id: user._id.toString(),
        fullName: user.fullName,
        avatar: user.avatar,
      };
    });
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

  public async createUser(user: UserEntity): Promise<UserEntity | null> {
    const newUser = new User(user.toCreateObject());
    const savedUser = await newUser.save();

    return mapToEntity(savedUser);
  }

  public async updateProfile(user: UserEntity): Promise<UserEntity | null> {
    const updatedDoc = await User.findByIdAndUpdate(
      user.getID(),
      user.toUpdateObject(),
      { new: true }
    );
    return mapToEntity(updatedDoc);
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
