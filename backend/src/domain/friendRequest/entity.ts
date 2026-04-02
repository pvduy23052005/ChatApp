import { IFriendRequestProps, RequestStatus, ISenderProfile, IToObject } from "./type";

export class FriendRequestEntity {

  private id?: string | undefined;
  private senderId: string;
  private receiverId: string;
  private status: RequestStatus;
  private createdAt: Date;
  private senderProfile?: ISenderProfile | undefined;

  private constructor(data: IFriendRequestProps) {
    this.id = data.id?.toString();
    this.senderId = data.senderId?.toString();
    this.receiverId = data.receiverId?.toString();
    this.status = data.status || "pending";
    this.createdAt = data.createdAt || new Date();
    this.senderProfile = data.senderProfile;
  }

  public static sendNewRequest(senderId: string, receiverId: string): FriendRequestEntity {

    if (senderId === receiverId) {
      throw new Error("Không thể tự gửi lời mời kết bạn cho chính mình");
    }

    return new FriendRequestEntity({
      senderId,
      receiverId,
      status: "pending",
      createdAt: new Date(),
    });
  }

  public accept(): void {
    if (this.status != "pending") {
      throw new Error("Không thể chấp nhận lời mời kết bạn không ở trạng thái chờ xử lý");
    }
    this.status = "accepted";
  }

  public reject(): void {
    if (this.status != "pending") {
      throw new Error("Không thể từ chối lời mời kết bạn không ở trạng thái chờ xử lý");
    }
    this.status = "rejected";
  }

  public static restore(data: IFriendRequestProps): FriendRequestEntity {
    return new FriendRequestEntity(data);
  }

  public toObject(): IToObject {
    return {
      id: this.id,
      senderId: this.senderId,
      receiverId: this.receiverId,
      status: this.status,
      createdAt: this.createdAt,
      senderProfile: this.senderProfile,
    }
  }

  public getStatus(): RequestStatus { return this.status; }
  public getId(): string | undefined { return this.id; }
  public getSenderId(): string { return this.senderId; }
  public getReceiverId(): string { return this.receiverId; }
}