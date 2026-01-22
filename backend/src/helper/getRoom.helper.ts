import { Response } from 'express';
import Room from '../models/room.model';
import mongoose from 'mongoose';
interface ObjectRoom {
  _id: string;
  title: string;
  typeRoom: string;
  avatar: string;
  lastMessage: {
    content: string;
    status: "sent" | "seen";
    user_id: string;
  };
  updatedAt: Date;
  otherUserId?: string;
  statusOnline: "online" | "offline";
}

const getRoom = async (res: Response, status: string): Promise<ObjectRoom[]> => {
  try {
    const myIDString = res.locals.user.id;
    const myID = new mongoose.Types.ObjectId(myIDString);
    // 2. Query Database
    const rooms: any = await Room.find({
      "members": {
        $elemMatch: {
          user_id: myID,
        }
      },
      deleted: false
    })
      .sort({ updatedAt: -1 })
      .lean()
      .populate({
        path: "members.user_id",
        select: "fullName avatar statusOnline"
      })
      .populate({
        path: "lastMessageId",
        select: "content status user_id"
      });
    const listRoom = rooms.map((room: any): ObjectRoom | null => {
      const otherMember = room.members.find(
        (member: any) => member.user_id._id.toString() !== myID.toString()
      );
      let titleRoom = "";
      let avatarRoom = "";
      let statusOnline: "online" | "offline" = "offline";
      let ortherUser_id = "";
      if (room.typeRoom === "single") {
        if (otherMember && otherMember.user_id) {
          titleRoom = otherMember.user_id.fullName;
          avatarRoom = otherMember.user_id.avatar || "/images/default-avatar.webp";
          statusOnline = otherMember.user_id.statusOnline;
          ortherUser_id = otherMember.user_id._id.toString();
        }
      } else {
        titleRoom = room.title;
        avatarRoom = room.avatar || "/images/default-avatar.webp";

        const isSomeoneOnline = room.members.some(
          (member: any) =>
            member.user_id &&
            member.user_id._id.toString() !== myID &&
            member.user_id.statusOnline === "online"
        );
        statusOnline = isSomeoneOnline ? "online" : "offline";
      }

      // login last message . 
      const lastMsg = room.lastMessageId ? {
        content: room.lastMessageId.content,
        status: room.lastMessageId.status,
        user_id: room.lastMessageId.user_id.toString()
      } : {
        content: "Bắt đầu trò chuyện ngay",
        status: "seen" as "seen",
        user_id: ""
      };

      return {
        _id: room._id.toString(),
        title: titleRoom,
        typeRoom: room.typeRoom,
        avatar: avatarRoom,
        lastMessage: lastMsg,
        updatedAt: room.updatedAt,
        statusOnline: statusOnline,
        otherUserId: ortherUser_id,
      };
    }).filter((item: ObjectRoom | null) => item !== null);

    return listRoom;

  } catch (error) {
    console.log("Error getRoom:", error);
    return [];
  }
}

export default getRoom;