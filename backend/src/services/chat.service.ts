import * as chatRepository from "../repositories/chat.repository";
import mongoose from "mongoose";

export const getChatHistory = async (roomID: string) => {

  if (!roomID) {
    throw new Error("Vui lòng cung cấp ID phòng");
  }

  if (!mongoose.Types.ObjectId.isValid(roomID)) {
    throw new Error("ID phòng không đúng định dạng");
  }

  const listMessages = await chatRepository.getMessageByRoomID(roomID);

  return listMessages;
}