import * as chatRepository from "../../../infrastructure/database/repositories/chat.repository";
import mongoose from "mongoose";


export class GetChatHistoryUseCase {
  private readonly chatRepository: chatRepository.ChatRepository;

  constructor(chatRepository: chatRepository.ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(roomID: string) {
    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    if (!mongoose.Types.ObjectId.isValid(roomID)) {
      throw new Error("ID phòng không đúng định dạng");
    }


    const listMessages = await this.chatRepository.getMessageByRoomID(roomID);

    return listMessages;
  }

}
