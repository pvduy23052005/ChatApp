import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

export const isUserInRoom = async (roomID: string, userID: string): Promise<any> => {
  try {

    if (!roomID || !userID) {
      throw new Error("Vui lòng cung cấp ID phòng và ID người dùng");
    }

    const room = await roomRepository.findRoomWithUser(roomID, userID);

    return room;
  } catch (error) {
    console.error("Lỗi check user in room:", error);
    return false;
  }
}
