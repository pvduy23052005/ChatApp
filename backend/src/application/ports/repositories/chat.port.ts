import { ChatEntity } from "../../../domain/chat/chat.entity";

export interface IChatReadRepository {
  getMessageByRoomID(roomID: string, cursor?: string, limit?: number): Promise<ChatEntity[] | null>
  findById(id: string): Promise<ChatEntity | null>;
}

export interface IChatWriteRepository {
  create(chat: ChatEntity): Promise<ChatEntity | null>;

  markMessageAsRead(messageID: string, userID: string): Promise<void>;

  update(chat: ChatEntity): Promise<void>;
}
