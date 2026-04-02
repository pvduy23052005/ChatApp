import { ILastMessage, IGetRoom, IRoom } from "./type";

export class RoomEntity {
  private id: string;
  private title: string;
  private typeRoom: string;
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;
  private members: any[];
  private lastMessageId: any;

  public constructor(data: IRoom) {
    this.id = data.id;
    this.title = data.title;
    this.typeRoom = data.typeRoom;
    this.avatar = data.avatar;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.members = data.members || [];
    this.lastMessageId = data.lastMessageId;
  }

  public getRoom(currentUserID: string): IGetRoom {
    const { title, avatar, otherUserId } = this.getTitleRoom(currentUserID);

    const lastMessage = this.getLastMessage();

    const statusOnline = this.isMemberOnline(currentUserID) ? "online" : "offline";

    return {
      _id: this.id,
      title: title,
      typeRoom: this.typeRoom,
      avatar: avatar,
      lastMessage: lastMessage,
      statusOnline: statusOnline,
      updatedAt: this.updatedAt,
      otherUserId: otherUserId,
    };
  }

  private getOtherMember(currentUserID: string) {
    return this.members.find(
      (m: any) => m.user_id && m.user_id._id.toString() !== currentUserID
    );
  }

  private getTitleRoom(currentUserID: string) {
    if (this.typeRoom === "single") {
      const otherMember = this.getOtherMember(currentUserID);

      if (otherMember && otherMember.user_id) {
        return {
          title: otherMember.user_id.fullName,
          avatar: otherMember.user_id.avatar || "/images/default-avatar.webp",
          otherUserId: otherMember.user_id._id.toString()
        };
      }
    }

    return {
      title: this.title,
      avatar: this.avatar || "/images/default-avatar.webp",
      otherUserId: ""
    }
  }

  private isMemberOnline(currentUserID: string): boolean {
    return this.members.some(
      (m: any) =>
        m.user_id &&
        m.user_id._id.toString() !== currentUserID &&
        m.user_id.statusOnline === "online"
    );
  }

  private getLastMessage(): ILastMessage {
    if (!this.lastMessageId) {
      const lastMessage = {
        content: "Bắt đầu trò chuyện ngay",
        status: "seen" as "seen",
        user_id: ""
      }
      return lastMessage;
    }

    const lastMessage = {
      content: this.lastMessageId.content,
      status: this.lastMessageId.status,
      user_id: this.lastMessageId?.user_id?.toString() || "",
      readBy: this.lastMessageId.readBy
    }
    return lastMessage;
  }

  public getID(): string { return this.id; }
  public getName(): string { return this.title; }
  public getTypeRoom(): string { return this.typeRoom; }
  public getStatus(): string { return this.status; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getMembers(): any[] { return this.members; }
}
