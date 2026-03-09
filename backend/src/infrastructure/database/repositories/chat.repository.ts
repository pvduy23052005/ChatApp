import Chat from "../model/chat.model"
import { IChatRepository } from "../../../domain/interfaces/chat.interface";
import { ChatEntity } from "../../../domain/entities/chat.entity";

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

export class ChatRepository implements IChatRepository {
  public async getMessageByRoomID(roomID: string): Promise<ChatEntity[] | null> {
    const query: any = {
      room_id: roomID,
      deleted: false,
    }

    const messages = await Chat.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select: "fullName avatar"
      }).lean();

    const listMessages = messages.map((message: any) => mapToEntity(message)).filter((message: ChatEntity | null) => message !== null);
    return listMessages.reverse();
  }
}