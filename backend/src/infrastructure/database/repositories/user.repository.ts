import User from "../model/user.model";
import { IUserRepository } from "../../../domain/interfaces/user.interface";
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

export class UserRepository implements IUserRepository {

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    return mapToEntity(user);
  }

  public async updateUserStatus(userID: string, status: string): Promise<any> {
    return await User.updateOne({ _id: userID }, { statusOnline: status });
  }

  public async findUserById(userID: string): Promise<UserEntity | null> {
    const user = await User.findOne({ _id: userID, deleted: false });
    return mapToEntity(user);
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

  public async updateProfile(userID: string, dataUpdate: any): Promise<any> {
    const user = await User.findByIdAndUpdate(userID, dataUpdate, { new: true }).select("-password");
    return user;
  }
}
