import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

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
