export interface INotifyOutputDTO {
  type: string;
  content: string;
  room_id: string;
  id: string | undefined;
  readBy: string[];
  createdAt: Date | undefined;
}
