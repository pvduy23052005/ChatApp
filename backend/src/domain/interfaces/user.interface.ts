import { UserEntity } from "../entities/user.entity";

export interface IUserReadRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserById(userID: string): Promise<UserEntity | null>;
  findUsersNotInList(listId: string[]): Promise<any[]>;
  findUsersInList(listId: string[]): Promise<any[]>;
  findFriendNotInRoom(friendIDs: string[], memberIDs: string[]): Promise<any[]>;
  findUserFullName(userID: string): Promise<string | undefined>;
}

export interface IUserWriteRepository {
  updateUserStatus(userID: string, status: string): Promise<any>;
  createUser(fullName: string, email: string, password: string): Promise<UserEntity | null>;
  updateProfile(userID: string, dataUpdate: any): Promise<any>;
}

export interface IFriendShipRepository {
  addFriendRequest(myID: string, friendID: string): Promise<void>;
  addFriendAccept(myID: string, friendID: string): Promise<void>;
  removeFriendRequest(myID: string, friendID: string): Promise<void>;
  removeFriendAccept(myID: string, friendID: string): Promise<void>;
  addFriendToList(myID: string, friendID: string, roomChatId: string): Promise<void>;
}