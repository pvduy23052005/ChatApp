import * as roomRepository from "../repositories/room.repository";

interface ObjectRoom {
  _id: string;
  title: string;
  typeRoom: string;
  avatar: string;
  lastMessage: {
    content: string;
    status: "sent" | "seen";
    user_id: string;
    readBy?: string[];
  };
  updatedAt: Date;
  otherUserId?: string;
  statusOnline: "online" | "offline";
}

export const getRoom = async (userID: string, status: string): Promise<ObjectRoom[]> => {

  if (!status || !userID) {
    throw new Error("Vui lòng cung cấp trạng thái phòng và ID người dùng");
  }

  const allowedStatus = ["accepted", "waiting"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  const rooms: any = await roomRepository.getRoomByUserAndStatus(userID, status);

  if (!rooms || rooms.length === 0) return [];

  const listRooms = rooms.map((room: any): ObjectRoom => {
    const otherMember = room.members.find(
      (member: any) => member.user_id._id.toString() !== userID
    )

    let titleRoom = "";
    let avatarRoom = "";
    let statusOnline: "online" | "offline" = "offline";
    let otherUserId = "";

    if (room.typeRoom === "single") {
      if (otherMember && otherMember.user_id) {
        titleRoom = otherMember.user_id.fullName;
        avatarRoom = otherMember.user_id.avatar || "/images/default-avatar.webp";
        statusOnline = otherMember.user_id.statusOnline;
        otherUserId = otherMember.user_id._id.toString();
      }
    } else {
      titleRoom = room.title;
      avatarRoom = room.avatar || "/images/default-avatar.webp";
      const isSomeoneOnline = room.members.some(
        (member: any) =>
          member.user_id &&
          member.user_id._id.toString() !== userID &&
          member.user_id.statusOnline === "online"
      );
      statusOnline = isSomeoneOnline ? "online" : "offline";
    }

    const lastMsg = room.lastMessageId ? {
      content: room.lastMessageId.content,
      status: room.lastMessageId.status,
      user_id: room.lastMessageId?.user_id?.toString() || "",
      readBy: room.lastMessageId.readBy
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
      otherUserId: otherUserId,
    };
  });

  return listRooms;
}

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