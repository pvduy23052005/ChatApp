import { ILastMessage, IRoomMember, IRoom } from "./type";

export class RoomEntity {
  private id: string;
  private title: string;
  private typeRoom: "single" | "group";
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;
  private members: IRoomMember[];
  private lastMessageId: any;

  public constructor(data: IRoom) {
    this.id = data.id || "";
    this.title = data.title;
    this.typeRoom = data.typeRoom;
    this.avatar = data.avatar || "/images/default-avatar.webp";
    this.status = data.status || "active";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.members = data.members || [];
    this.lastMessageId = data.lastMessageId;
  }

  public static createRoom(creatorId: string, memberIds: string[], typeRoom: "single" | "group", title?: string, avatar?: string) {

    let members = [];

    if (typeRoom === "group") {
      members = [
        { user_id: creatorId, role: "superAdmin", status: "accepted" },
        ...memberIds.map(id => ({ user_id: id, role: "member", status: "accepted" }))
      ];
    } else {
      members = [
        { user_id: creatorId, role: "member", status: "accepted" },
        { user_id: memberIds[0], role: "member", status: "waiting" }
      ];
    }

    return new RoomEntity({
      title: title || "",
      typeRoom: typeRoom,
      members,
      avatar: avatar || "/images/default-avatar.webp"
    });
  }

  public toObject() {
    return {
      id: this.id,
      title: this.title,
      typeRoom: this.typeRoom,
      avatar: this.avatar,
      status: this.status,
      members: this.members,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastMessageId: this.lastMessageId
    };
  }

  public getId(): string { return this.id; }
  public getTitle(): string { return this.title; }
  public getTypeRoom(): string { return this.typeRoom; }
  public getStatus(): string { return this.status; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getMembers(): any[] { return this.members; }
}
