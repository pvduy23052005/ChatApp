import { IDataChat } from "../../application/use-cases/chat/send-message.use-case";
import { ChatEntity } from "../entities/chat.entity";

export interface IChatRepository {
  getMessageByRoomID(roomID: string): Promise<ChatEntity[] | null>;

  createNewMessage(dataChat: IDataChat): Promise<ChatEntity | null>;
}