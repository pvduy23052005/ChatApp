import { RoomEntity } from "../../../domain/room/entity";
import { GetRoomOutputDTO } from "../../dtos/room/get-room.dto";

export interface IRoomReadRepository {
  findRoomWithUser(roomID: string, userID: string): Promise<any>;
  checkRoomExist(myID: string, userID: string): Promise<RoomEntity | null>;
  findRoomById(roomID: string): Promise<RoomEntity | null>;
  getRoomByUserAndStatus(userID: string, status: string): Promise<GetRoomOutputDTO[]>;
}

export interface IRoomWriteRepository {
  createNewRoom(room: RoomEntity): Promise<RoomEntity>;
  update(room: RoomEntity): Promise<void>;
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
