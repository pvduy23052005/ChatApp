import Room from "../models/room.model";

export const isUserInRoom = async (roomId: string, userId: string) => {
  try {
    const room = await Room.findOne({
      _id: roomId,
      "members.user_id": userId,
      deleted: false
    });

    return room;
  } catch (error) {
    console.error("Lỗi check user in room:", error);
    return false;
  }
};
