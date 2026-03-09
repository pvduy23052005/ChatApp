import { ChatEntity } from "../entities/chat.entity";

export interface IChatRepository {
  getMessageByRoomID(roomID: string): Promise<ChatEntity[] | null>;
}