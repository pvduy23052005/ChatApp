import { IChatWriteRepository } from "../../ports/chat.port";
import { IRoomWriteRepository } from "../../ports/room.port";
import { ChatEntity } from "../../../domain/chat/entities/chat.entity";
import { IChatDetail } from "../../../domain/chat/entities/chat.type";
export interface IDataChat {
  user_id: string;
  content: string;
  room_id: string;
  images: string[];
}

export class SendMessageUseCase {

  constructor(
    private readonly chatWriteRepo: IChatWriteRepository,
    private readonly roomRepo: IRoomWriteRepository,
  ) { }

  async execute(dataChat: IDataChat): Promise<IChatDetail | null> {
    const { user_id, room_id, content, images } = dataChat;

    const newMessage = ChatEntity.create({
      user_id: user_id,
      room_id: room_id,
      content: content,
      images: images,
    });

    const message = await this.chatWriteRepo.create(newMessage);

    if (!message) {
      throw new Error("Failed to create message");
    }

    await this.roomRepo.updateLastMessage(room_id, message.getId());

    return message.getDetail() || null;
  }
}