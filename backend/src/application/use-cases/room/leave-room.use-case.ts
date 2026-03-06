import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

export const leaveRoom = async (roomID: string, myID: string, room: any) => {

  const myInfo = room.members.find(
    (member: any) => member.user_id.toString() === myID
  );

  if (myInfo && myInfo.role === "superAdmin") {
    throw new Error("Vui lòng chỉ định người khác làm Trưởng nhóm trước khi rời");
  }

  await roomRepository.removeMemberFromRoom(roomID, myID);
}
