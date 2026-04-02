export type RequestStatus = "pending" | "accepted" | "rejected";

export interface ISenderProfile {
  fullName: string;
  avatar: string;
}

export interface IFriendRequestProps {
  id?: string;
  senderId: string;
  receiverId: string;
  status: RequestStatus;
  createdAt: Date;
  senderProfile?: ISenderProfile;
}
