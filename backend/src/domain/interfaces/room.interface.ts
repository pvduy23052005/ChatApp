import { RoomEntity } from "../entities/room.entity";

export interface IRoomRepository {
  getRoomByUserAndStatus(userID: string, status: string): Promise<RoomEntity[] | []>;

  findRoomWithUser(roomID: string, userID: string): Promise<any>;

  checkRoomExist(myID: string, userID: string): Promise<any>;

  createNewRoom(newRoomData: any): Promise<any>;

  findRoomById(roomID: string): Promise<any>;

  updateRoomTitle(roomID: string, title: string): Promise<void>;

  addMembersToRoom(roomID: string, newMembers: { user_id: string, role: string, status: string }[]): Promise<void>;

  removeMemberFromRoom(roomID: string, memberID: string): Promise<void>;

  softDeleteRoom(roomID: string): Promise<void>;

  assignAdminRole(roomID: string, memberID: string): Promise<void>;

  updateLastMessage(roomID: string, messageID: any): Promise<void>;

  updateMemberStatus(roomID: string, status: string): Promise<void>;
}