import { RoomEntity } from "../../domain/entities/room/room.entity";

export interface IRoomReadRepository {
  getRoomByUserAndStatus(userID: string, status: string): Promise<RoomEntity[] | []>;
  findRoomWithUser(roomID: string, userID: string): Promise<any>;
  checkRoomExist(myID: string, userID: string): Promise<any>;
  findRoomById(roomID: string): Promise<any>;
}

export interface IRoomWriteRepository {
  createNewRoom(newRoomData: any): Promise<any>;
  updateRoomTitle(roomID: string, title: string): Promise<void>;
  softDeleteRoom(roomID: string): Promise<void>;
  updateLastMessage(roomID: string, messageID: any): Promise<void>;
}

export interface IRoomMemberRepository {
  addMembersToRoom(roomID: string, newMembers: { user_id: string, role: string, status: string }[]): Promise<void>;
  removeMemberFromRoom(roomID: string, memberID: string): Promise<void>;
  assignAdminRole(roomID: string, memberID: string): Promise<void>;
  updateMemberStatus(roomID: string, status: string): Promise<void>;
}
