import Chat from "../model/chat.model"
import { IChatReadRepository, IChatWriteRepository } from "../../../domain/interfaces/chat.interface";
import { ChatEntity } from "../../../domain/entities/chat.entity";
import { IDataChat } from "../../../application/use-cases/chat/send-message.use-case";

const mapToEntity = (doc: any) => {
  if (!doc) return null;

  return new ChatEntity({
    id: doc._id.toString(),
    room_id: doc.room_id.toString(),
    user_id: doc.user_id._id.toString(),
    content: doc.content?.trim(),
    images: doc.images,
    type: doc.type,
    status: doc.status,
    readBy: doc.readBy,

    sender: {
      id: doc.user_id._id.toString(),
      fullName: doc.user_id.fullName,
      avatar: doc.user_id.avatar
    },

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    deleted: doc.deleted,
    deletedAt: doc.deletedAt,
  });
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
}

export class ChatWriteRepository implements IChatWriteRepository {
  public async createNewMessage(dataChat: IDataChat): Promise<ChatEntity | null> {

    const newChat = new Chat({
      user_id: dataChat.user_id,
      content: dataChat.content,
      room_id: dataChat.room_id,
      images: dataChat.images,
      readBy: [dataChat.user_id]
    });

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
}