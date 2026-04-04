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

  public static createFriendRoom(userAId: string, userBId: string) {
    const members = [
      { user_id: userAId, role: "member", status: "accepted" },
      { user_id: userBId, role: "member", status: "accepted" }
    ];

    return new RoomEntity({
      title: "",
      typeRoom: "single",
      members,
      avatar: "/images/default-avatar.webp"
    });
  }

  public acceptAllMembers(): void {
    this.members = this.members.map(member => ({
      ...member,
      status: "accepted"
    }));
  }

  public addMember(userId: string): void {
    if (this.typeRoom === "single") {
      throw new Error("Không thể thêm thành viên vào phòng chat cá nhân");
    }

    const isExist = this.members.some(m => m.user_id.toString() === userId);
    if (isExist) {
      throw new Error("Người dùng đã là thành viên của phòng");
    }

    this.members.push({
      user_id: userId,
      role: "member",
      status: "accepted"
    });
    this.updatedAt = new Date();
  }

  public removeMember(removeMemberID: string, requesterID: string): void {

    const requester = this.members.find(m => m.user_id.toString() === requesterID);
    if (!requester || (requester.role !== "superAdmin" && requester.role !== "admin")) {
      throw new Error("Bạn không có quyền xóa thành viên");
    }

    if (removeMemberID === requesterID) {
      throw new Error("Không thể xóa chính mình khỏi nhóm");
    }

    const initialLength = this.members.length;
    this.members = this.members.filter(m => m.user_id.toString() !== removeMemberID);

    if (this.members.length === initialLength) {
      throw new Error("Người dùng không phải là thành viên của phòng");
    }
    this.updatedAt = new Date();
  }

  public leaveRoom(userId: string): void {
    const memberIndex = this.members.findIndex(m => m.user_id.toString() === userId);

    if (memberIndex === -1) {
      throw new Error("Bạn không phải là thành viên của phòng này");
    }

    const member = this.members.find(m => m.user_id.toString() === userId);

    if (member?.role === "superAdmin") {
      throw new Error("Không thể rời khỏi phòng khi là trưởng nhóm");
    }

    this.members.splice(memberIndex, 1);
    this.updatedAt = new Date();
  }

  public assignAdmin(targetUserId: string, requesterId: string): void {
    if (!targetUserId) {
      throw new Error("Vui lòng chọn thành viên để chỉ định làm quản trị viên");
    }

    if (targetUserId === requesterId) {
      throw new Error("Bạn không thể tự thao tác lên chính mình");
    }

    const requester = this.members.find(m => m.user_id.toString() === requesterId);
    if (!requester || (requester.role !== "superAdmin" && requester.role !== "admin")) {
      throw new Error("Bạn không có quyền chỉ định quản trị viên");
    }

    const targetMember = this.members.find(m => m.user_id.toString() === targetUserId);
    if (!targetMember) {
      throw new Error("Người dùng này không có mặt trong phòng");
    }

    if (targetMember.role === "admin" || targetMember.role === "superAdmin") {
      throw new Error("Người dùng này đã là quản trị viên rồi");
    }

    targetMember.role = "admin";
    this.updatedAt = new Date();
  }

  public static restore(data: IRoom): RoomEntity {
    return new RoomEntity(data);
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
  public getLastMessageId(): string { return this.lastMessageId };
}
