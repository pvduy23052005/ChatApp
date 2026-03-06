import * as userRepository from "../../../infrastructure/database/repositories/user.repository";

export const getFriendAccepts = async (user: any) => {

  if (!user.friendAccepts || user.friendAccepts.length === 0) {
    return [];
  }

  const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
  const users = await userRepository.findUsersInList(acceptIDs);
  return users;
}
