export interface GetRoomOutputDTO {
  id: string;
  title: string;
  typeRoom: string;
  avatar: string;
  lastMessage: {
    content: string;
    status: string;
    user_id: string;
    readBy?: string[];
  };
  updatedAt: Date;
  otherUserId?: string;
  statusOnline: "online" | "offline";
}
