import User from "../models/user.model";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email: email, deleted: false });
}

export const findUserById = async (id: string) => {
  return await User.findOne({ _id: id, deleted: false });
}

export const updateUserStatus = async (userID: string, status: string) => {
  return await User.updateOne({ _id: userID }, { statusOnline: status });
}

export const createUser = async (fullName: string, email: string, password: string) => {
  const userObject = {
    fullName: fullName,
    email: email,
    password: password,
    statusOffline: "offline",
  };

  const newUser = new User(userObject);

  return await newUser.save();
}

export const findUsersNotInList = async (listId: string[]) => {
  return await User.find({ _id: { $nin: listId }, deleted: false }).select("fullName avatar");
}

export const findUsersInList = async (listId: string[]) => {
  return await User.find({ _id: { $in: listId }, deleted: false }).select("fullName avatar");
}

export const findFriendNotInRoom = async (friendIDs: string[], memberIDs: string[]) => {
  const friends = await User.find(
    {
      _id: { $in: friendIDs, $nin: memberIDs },
      deleted: false
    }).select("fullName avatar");

  return friends;
}

export const updateProfile = async (userID: string, dataUpdate: any) => {
  const user = await User.findByIdAndUpdate(userID, dataUpdate, { new: true }).select("-password");
  return user;
}
