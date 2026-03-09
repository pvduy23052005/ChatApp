import Room from "../model/room.model";
import { IRoomRepository } from "../../../domain/interfaces/room.interface";
import { RoomEntity } from "../../../domain/entities/room.entity";
import mongoose from "mongoose";

const mapToEntity = (doc: any): RoomEntity => {
  return new RoomEntity({
    id: doc._id.toString(),
    title: doc.title,
    typeRoom: doc.typeRoom,
    avatar: doc.avatar,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    members: doc.members,
    lastMessageId: doc.lastMessageId
  })
}

export class RoomRepository implements IRoomRepository {

  async getRoomByUserAndStatus(userID: string, status: string): Promise<RoomEntity[] | []> {
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

    if (!rooms || rooms.length === 0) return [];

    const roomsEntity: RoomEntity[] = rooms.map((room: any) => mapToEntity(room));

    return roomsEntity;
  }
}

export const findRoomWithUser = async (roomID: string, userID: string) => {

  const room = await Room.findOne({
    _id: roomID,
    "members.user_id": userID,
    deleted: false,
  }).lean();

  return room;
}


export const checkRoomExist = async (myID: string, userID: string) => {

  const room = await Room.findOne({
    typeRoom: "single",
    "members.user_id": {
      $all: [myID, userID]
    }
  }).select("_id").lean();

  return room;
}

export const createNewRoom = async (newRoomData: any) => {
  const newRoom = new Room(newRoomData);

  await newRoom.save();

  return newRoom;
}

export const findRoomById = async (roomID: string) => {
  const room = await Room.findOne({
    _id: roomID,
    deleted: false
  }).lean();

  return room;
}

export const updateRoomTitle = async (roomID: string, title: string) => {
  await Room.updateOne(
    { _id: roomID },
    { $set: { title: title } }
  );
}

export const addMembersToRoom = async (roomID: string, newMembers: { user_id: string, role: string, status: string }[]) => {
  await Room.updateOne(
    { _id: roomID },
    { $push: { members: { $each: newMembers } } }
  );
}

export const removeMemberFromRoom = async (roomID: string, memberID: string) => {
  await Room.updateOne(
    { _id: roomID },
    { $pull: { members: { user_id: memberID } } }
  );
}

export const softDeleteRoom = async (roomID: string) => {
  await Room.updateOne(
    { _id: roomID },
    { deleted: true, deletedAt: new Date() }
  );
}

export const assignAdminRole = async (roomID: string, memberID: string) => {
  await Room.updateOne(
    { _id: roomID, "members.user_id": memberID },
    { $set: { "members.$.role": "superAdmin" } }
  );
}
