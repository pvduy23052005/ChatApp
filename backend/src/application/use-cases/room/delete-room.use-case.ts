import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

export const deleteRoom = async (roomID: string) => {

  if (!roomID) {
    throw new Error("Vui lòng cung cấp ID phòng");
  }

  await roomRepository.softDeleteRoom(roomID);
}
