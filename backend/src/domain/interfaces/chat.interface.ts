import { IDataChat } from "../../application/use-cases/chat/send-message.use-case";
import { ChatEntity } from "../entities/chat.entity";


export interface IChatReadRepository {
  getMessageByRoomID(roomID: string, cursor?: string, limit: number): Promise<ChatEntity[] | null>;
}

export interface IChatWriteRepository {
  createNewMessage(dataChat: IDataChat): Promise<ChatEntity | null>;

  createSystemMessage(roomID: string, content: string): Promise<any>;

  markMessageAsRead(messageID: string, userID: string): Promise<void>;
}