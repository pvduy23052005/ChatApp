import { IFriendRequestProps, RequestStatus, ISenderProfile } from "./type";

export class friendRequest {

  private id?: string;
  private senderId: string;
  private receiverId: string;
  private status: RequestStatus;
  private createdAt: Date;
  private senderProfile?: ISenderProfile;

  private constructor(data: IFriendRequestProps) {
    this.id = data.id?.toString() ?? "";
    this.senderId = data.senderId?.toString();
    this.receiverId = data.receiverId?.toString();
    this.status = data.status || "pending";
    this.createdAt = data.createdAt || new Date();
  }

  public static sendNewRequest(senderId: string, receiverId: string): friendRequest {

    if (senderId === receiverId) {
      throw new Error("Không thể tự gửi lời mời kết bạn cho chính mình");
    }

    return new friendRequest({
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

  public static restore(data: IFriendRequestProps): friendRequest {
    return new friendRequest(data);
  }

  public getStatus(): RequestStatus { return this.status; }
  public getSenderId(): string { return this.senderId; }
  public getReceiverId(): string { return this.receiverId; }
}