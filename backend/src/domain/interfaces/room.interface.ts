import { RoomEntity } from "../entities/room.entity";

export interface IRoomRepository {

  getRoomByUserAndStatus(userID: string, status: string): Promise<RoomEntity[] | []>;
}