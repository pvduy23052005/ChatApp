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