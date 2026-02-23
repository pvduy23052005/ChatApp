import * as chatRepository from "../repositories/chat.repository";

export const getChatHistory = async (roomID: string) => {

  const listMessages = await chatRepository.getMessageByRoomID(roomID);

  return listMessages;
}