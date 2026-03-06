import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";

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
