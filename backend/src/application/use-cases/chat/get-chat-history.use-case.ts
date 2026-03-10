import { IChatReadRepository } from "../../../domain/interfaces/chat.interface";
import mongoose from "mongoose";


export class GetChatHistoryUseCase {
  private readonly chatRepository: IChatReadRepository;

  constructor(chatRepository: IChatReadRepository) {
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
