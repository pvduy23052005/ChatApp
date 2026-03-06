import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

export const assignAdmin = async (roomID: string, newAdminID: string, myID: string) => {

  if (!newAdminID) {
    throw new Error("Vui lòng chọn thành viên để chỉ định làm quản trị viên");
  }

  if (newAdminID === myID) {
    throw new Error("Bạn đã là quản trị viên của phòng");
  }

  await roomRepository.assignAdminRole(roomID, newAdminID);
}
