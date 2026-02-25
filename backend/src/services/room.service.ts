import * as roomRepository from "../repositories/room.repository";
import * as userRepository from "../repositories/user.repository";

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

export const createNewRoom = async (myID: string, titleRoom: string, members: string[]) => {

  if (!titleRoom) {
    throw new Error("Nhập tên phòng");
  }

  if (!members) {
    throw new Error("Vui lòng chọn thành viên");
  }

  const memberIDs: string[] = Array.isArray(members)
    ? [...members]
    : [members];


  if (memberIDs.length === 1) {
    const userID: string = memberIDs[0]!;
    const existRoom = await roomRepository.checkRoomExist(myID, userID);
    if (existRoom) {
      throw new Error("Phòng này đã tồn tại");
    }
  }

  const newRoomData = {
    title: titleRoom,
    typeRoom: "group",
    members: [
      {
        user_id: myID,
        role: "superAdmin",
        status: "accepted"
      }
    ]
  }

  memberIDs.forEach((memberID) => {
    newRoomData.members.push({
      user_id: memberID,
      role: "member",
      status: "accepted"
    })
  });

  const newRoom = await roomRepository.createNewRoom(newRoomData);

  return newRoom;
}

export const getDetailRoom = async (roomID: string, user: any) => {

  if (!roomID || !user) {
    throw new Error("Vui lòng cung cấp ID phòng và ID người dùng");
  }

  const existRoom = await roomRepository.findRoomById(roomID);

  if (!existRoom) {
    throw new Error("Phòng không tồn tại");
  }

  const memberIDs = existRoom.members.map(
    (member: any) => member.user_id._id.toString());
  const friendIDs = user?.friendList?.map(
    (user: any) => user.user_id.toString()
  ) || [];


  const friends = await userRepository.findFriendNotInRoom(friendIDs, memberIDs);

  return {
    detailRoom: existRoom,
    friends: friends
  }
}

export const editRoom = async (roomID: string, title: string) => {

  if (!title || title.trim() === "") {
    throw new Error("Tên phòng không được để trống!");
  }

  const trimmedTitle = title.trim();

  await roomRepository.updateRoomTitle(roomID, trimmedTitle);

  return {
    _id: roomID,
    title: trimmedTitle
  };
}

export const addMember = async (roomID: string, newMemberIDs: string | string[], room: any) => {

  const memberIDs: string[] = Array.isArray(newMemberIDs)
    ? newMemberIDs
    : [newMemberIDs];

  const existMemberIDs = room.members.map(
    (member: any) => member.user_id.toString()
  );

  const filteredMemberIDs = memberIDs.filter(
    (userID: string) => !existMemberIDs.includes(userID)
  );

  if (filteredMemberIDs.length === 0) {
    throw new Error("Tất cả người dùng được chọn đã có mặt trong phòng");
  }

  const listNewMembers = filteredMemberIDs.map((userId: string) => ({
    user_id: userId,
    role: "member",
    status: "accepted"
  }));

  await roomRepository.addMembersToRoom(roomID, listNewMembers);

  return filteredMemberIDs;
}

export const removeMember = async (roomID: string, removeMemberID: string, myID: string) => {

  if (removeMemberID === myID) {
    throw new Error("Không thể xóa chính mình khỏi nhóm");
  }

  await roomRepository.removeMemberFromRoom(roomID, removeMemberID);

  return removeMemberID;
}

export const deleteRoom = async (roomID: string) => {

  if (!roomID) {
    throw new Error("Vui lòng cung cấp ID phòng");
  }

  await roomRepository.softDeleteRoom(roomID);
}

export const leaveRoom = async (roomID: string, myID: string, room: any) => {

  const myInfo = room.members.find(
    (member: any) => member.user_id.toString() === myID
  );

  if (myInfo && myInfo.role === "superAdmin") {
    throw new Error("Vui lòng chỉ định người khác làm Trưởng nhóm trước khi rời");
  }

  await roomRepository.removeMemberFromRoom(roomID, myID);
}

export const assignAdmin = async (roomID: string, newAdminID: string, myID: string) => {

  if (!newAdminID) {
    throw new Error("Vui lòng chọn thành viên để chỉ định làm quản trị viên");
  }

  if (newAdminID === myID) {
    throw new Error("Bạn đã là quản trị viên của phòng");
  }

  await roomRepository.assignAdminRole(roomID, newAdminID);
}