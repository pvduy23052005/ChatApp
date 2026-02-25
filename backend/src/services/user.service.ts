import * as userRepository from "../repositories/user.repository";

export const getUsers = async (user: any) => {

  const myID = user.id.toString();
  const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
  const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
  const requestIDs: string[] = user.friendRequests.map((item: any) => item.toString());

  const listId = [
    myID,
    ...friendIDs,
    ...acceptIDs,
    ...requestIDs,
  ];

  const users = await userRepository.findUsersNotInList(listId);

  return users;
}

export const getFriendAccepts = async (user: any) => {

  if (!user.friendAccepts || user.friendAccepts.length === 0) {
    return [];
  }

  const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
  const users = await userRepository.findUsersInList(acceptIDs);
  return users;
}

export const getFriends = async (user: any) => {

  if (!user.friendList || user.friendList.length === 0) {
    return [];
  }

  const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
  const users = await userRepository.findUsersInList(friendIDs);
  return users;
}

export const editProfile = async (userID: string, data: any) => {
  const { fullName, avatar } = data;

  if (!userID) {
    throw new Error("Không tìm thấy người dùng!");
  }

  const updateData: any = {};

  if (fullName) {
    updateData.fullName = fullName;
  }

  if (avatar) {
    updateData.avatar = avatar;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Không có dữ liệu cập nhật!");
  }

  const user = await userRepository.updateProfile(userID, updateData);

  if (!user) {
    throw new Error("Cập nhật thất bại!");
  }

  return user;
}