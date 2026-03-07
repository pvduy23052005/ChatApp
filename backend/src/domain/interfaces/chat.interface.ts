export interface IChatInterface {
  getMessageByRoomID(roomID: string): Promise<any | null>;
}