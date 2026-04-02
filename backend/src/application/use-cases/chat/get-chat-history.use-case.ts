import { IChatReadRepository } from "../../ports/repositories/chat.port";

export class GetChatHistoryUseCase {

  constructor(private readonly chatRepository: IChatReadRepository) { }

  public async execute(roomID: string, cursor?: string, limit: number = 10) {
    if (!roomID) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    const listMessages = await this.chatRepository.getMessageByRoomID(roomID, cursor, limit);

    return listMessages?.map(message => message.getDetail());
  }
}
