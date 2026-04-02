export interface IChatProps {
  id?: string | undefined;
  user_id?: string | undefined;
  room_id: string;
  content?: string | undefined;
  images?: string[] | undefined;
  type?: "user" | "system" | undefined;
  status?: "sent" | "seen" | undefined;
  readBy?: string[] | undefined;
  deleted?: boolean | undefined;
  deletedAt?: Date | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;

  sender?: {
    id: string;
    fullName?: string;
    avatar?: string;
  };
}

export interface IChatDetail {
  id: string | undefined;
  user_id?: string | undefined;
  room_id: string;
  content: string;
  images: string[];
  type: string;
  status: string;
  readBy: string[];
  deleted: boolean;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  sender?: {
    id: string;
    fullName?: string;
    avatar?: string;
  };
}
