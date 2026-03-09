import { IChatRepository } from "../../../domain/interfaces/chat.interface";
import { IRoomRepository } from "../../../domain/interfaces/room.interface";

export interface IDataChat {
  user_id: string;
  content: string;
  room_id: string;
  images: string[];
}

export class SendMessageUseCase {

  constructor(
    private readonly chatRepo: IChatRepository,
    private readonly roomRepo: IRoomRepository,
  ) { }

  async execute(dataChat: IDataChat) {
    const { user_id, room_id, content, images } = dataChat;

    const newChat = await this.chatRepo.createNewMessage({
      user_id: user_id,
      room_id: room_id,
      content: content,
      images: images,
    });

    if (newChat && newChat.getId()) {
      await this.roomRepo.updateLastMessage(room_id, newChat.getId());
    }

    return newChat;
  }
}