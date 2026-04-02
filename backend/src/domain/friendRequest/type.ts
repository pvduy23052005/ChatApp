export type RequestStatus = "pending" | "accepted" | "rejected";

export interface ISenderProfile {
  fullName: string;
  avatar: string;
}

export interface IFriendRequestProps {
  id?: string | undefined;
  senderId: string;
  receiverId: string;
  status: RequestStatus;
  createdAt: Date;
  senderProfile?: ISenderProfile | undefined;
}

export interface IToObject {
  id?: string | undefined;
  senderId: string;
  receiverId: string;
  status: RequestStatus;
  createdAt: Date;
  senderProfile?: ISenderProfile | undefined;
}