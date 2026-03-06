import * as userRepository from "../../../infrastructure/database/repositories/user.repository";

export const getFriends = async (user: any) => {

  if (!user.friendList || user.friendList.length === 0) {
    return [];
  }

  const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
  const users = await userRepository.findUsersInList(friendIDs);
  return users;
}
