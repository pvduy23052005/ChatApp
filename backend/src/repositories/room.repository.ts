import Room from "../models/room.model";
import mongoose from "mongoose";

export const findRoomWithUser = async (roomID: string, userID: string) => {

  const room = await Room.findOne({
    _id: roomID,
    "members.user_id": userID,
    deleted: false,
  }).lean();

  return room;
}

export const getRoomByUserAndStatus = async (userID: string, status: string) => {
  const userObjectID = new mongoose.Types.ObjectId(userID);

  const rooms = await Room.find(
    {
      "members": {
        $elemMatch: {
          user_id: userObjectID,
          status: status
        }
      },
      deleted: false
    }
  )
    .sort({ updatedAt: -1 })
    .populate({
      path: "members.user_id",
      select: "fullName avatar statusOnline",
    })
    .populate({
      path: "lastMessageId",
      select: "content status user_id readBy"
    }).lean();

  return rooms;
}