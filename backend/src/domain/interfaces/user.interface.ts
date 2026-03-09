import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;

  updateUserStatus(userID: string, status: string): Promise<any>;

  findUserById(userID: string): Promise<UserEntity | null>;

  createUser(fullName: string, email: string, password: string): Promise<UserEntity | null>;

  findUsersNotInList(listId: string[]): Promise<any[]>;

  findUsersInList(listId: string[]): Promise<any[]>;

  findFriendNotInRoom(friendIDs: string[], memberIDs: string[]): Promise<any[]>;

  updateProfile(userID: string, dataUpdate: any): Promise<any>;

  addFriendRequest(myID: string, friendID: string): Promise<void>;

  addFriendAccept(myID: string, friendID: string): Promise<void>;

  removeFriendRequest(myID: string, friendID: string): Promise<void>;

  removeFriendAccept(myID: string, friendID: string): Promise<void>;

  addFriendToList(myID: string, friendID: string, roomChatId: string): Promise<void>;

  findUserFullName(userID: string): Promise<string | undefined>;
}