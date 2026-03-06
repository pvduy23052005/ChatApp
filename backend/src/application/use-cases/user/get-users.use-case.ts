import * as userRepository from "../../../infrastructure/database/repositories/user.repository";

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
