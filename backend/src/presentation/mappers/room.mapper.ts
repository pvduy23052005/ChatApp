import type { GetRoomOutputDTO } from "../../application/dtos/room/get-room.dto";

export class RoomQueryMapper {
  public static toDTO(rawRoom: any, currentUserID: string): GetRoomOutputDTO {
    let title = rawRoom.title;
    let avatar = rawRoom.avatar || "/images/default-avatar.webp";
    let otherUserId = "";

    if (rawRoom.typeRoom === "single") {
      const otherMember = rawRoom.members.find(
        (m: any) => m.user_id && m.user_id._id.toString() !== currentUserID
      );

      if (otherMember && otherMember.user_id) {
        title = otherMember.user_id.fullName;
        avatar = otherMember.user_id.avatar || "/images/default-avatar.webp";
        otherUserId = otherMember.user_id._id.toString();
      }
    }

    const lastMessage = !rawRoom.lastMessageId
      ? { content: "Bắt đầu trò chuyện ngay", status: "seen", user_id: "" }
      : {
        content: rawRoom.lastMessageId.content,
        status: rawRoom.lastMessageId.status,
        user_id: rawRoom.lastMessageId.user_id?.toString() || "",
        readBy: rawRoom.lastMessageId.readBy
      };

    const isMemberOnline = rawRoom.members.some(
      (m: any) =>
        m.user_id &&
        m.user_id._id.toString() !== currentUserID &&
        m.user_id.statusOnline === "online"
    );

    return {
      id: rawRoom._id.toString(),
      title,
      typeRoom: rawRoom.typeRoom,
      avatar,
      lastMessage,
      statusOnline: isMemberOnline ? "online" : "offline",
      updatedAt: rawRoom.updatedAt,
      otherUserId,
    };
  }
}