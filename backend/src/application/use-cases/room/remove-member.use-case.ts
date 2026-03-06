import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

export const removeMember = async (roomID: string, removeMemberID: string, myID: string) => {

  if (removeMemberID === myID) {
    throw new Error("Không thể xóa chính mình khỏi nhóm");
  }

  await roomRepository.removeMemberFromRoom(roomID, removeMemberID);

  return removeMemberID;
}
