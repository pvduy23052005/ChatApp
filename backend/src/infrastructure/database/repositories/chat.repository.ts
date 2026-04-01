import Chat from "../model/chat.model"
import { IChatReadRepository, IChatWriteRepository } from "../../../application/ports/chat.port";
import { ChatEntity } from "../../../domain/entities/chat/chat.entity";

const mapToEntity = (doc: any): ChatEntity | null => {
  if (!doc) return null;
  return ChatEntity.restore(doc);
}

export class ChatReadRepository implements IChatReadRepository {
  public async getMessageByRoomID(roomID: string, cursor?: string, limit: number = 10): Promise<ChatEntity[] | null> {
    const query: any = {
      room_id: roomID,
      deleted: false,
    }

    if (cursor) {
      query._id = { $lt: cursor }
    }

    const messages = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "user_id",
        select: "fullName avatar"
      }).lean();

    const listMessages = messages.map((message: any) => mapToEntity(message)).filter((message: ChatEntity | null) => message !== null);
    return listMessages.reverse();
  }

  public async findById(id: string): Promise<ChatEntity | null> {
    const doc = await Chat.findById(id).populate({
      path: "user_id",
      select: "fullName avatar"
    }).lean();

    return mapToEntity(doc);
  }
}

export class ChatWriteRepository implements IChatWriteRepository {
  public async create(chat: ChatEntity): Promise<ChatEntity | null> {

    const newChat = new Chat(chat.getDetail());

    await newChat.save().then(t => t.populate("user_id", "fullName avatar"));

    return mapToEntity(newChat);
  }

  public async createSystemMessage(roomID: string, content: string): Promise<any> {
    const dataChat = {
      type: "system",
      content: content,
      room_id: roomID,
    };
    const newChat = new Chat(dataChat);
    await newChat.save();
    return newChat;
  }

  public async markMessageAsRead(messageID: string, userID: string): Promise<void> {
    await Chat.findByIdAndUpdate(messageID, {
      $addToSet: { readBy: userID }
    });
  }

  public async update(chat: ChatEntity): Promise<void> {
    const id = chat.getId();
    if (!id) return;

    await Chat.findByIdAndUpdate(id, chat.getDetail());
  }
}