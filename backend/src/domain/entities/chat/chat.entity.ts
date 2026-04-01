import { IChatProps, IChatDetail } from "./chat.type";

export class ChatEntity {
  private id?: string | undefined;
  private user_id: string;
  private room_id: string;
  private content: string;
  private images: string[];
  private type: string;
  private status: string;
  private readBy: string[];
  private deleted: boolean;
  private createdAt?: Date | undefined;
  private updatedAt?: Date | undefined;
  private sender?: any | undefined;


  private constructor(data: IChatProps) {
    this.id = data.id || "";
    this.user_id = data.user_id.toString() || "";
    this.room_id = data.room_id.toString() || "";
    this.content = data.content?.trim() || "";
    this.images = Array.isArray(data.images) ? data.images : [];
    this.type = data.type || "user";
    this.status = data.status || "sent";
    this.readBy = data.readBy || [];
    this.deleted = data.deleted || false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.sender = data.sender;
  }


  public markAsRead(userID: string): void {
    if (!this.readBy.includes(userID)) {
      this.readBy.push(userID);
    }
    this.status = "seen";
  }

  public getDetail(): IChatDetail {
    return {
      id: this.id,
      user_id: this.user_id,
      room_id: this.room_id,
      content: this.content,
      images: this.images,
      type: this.type,
      status: this.status,
      readBy: this.readBy,
      deleted: this.deleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      sender: this.sender,
    }
  }

  public static restore(data: any): ChatEntity {
    const entityId = data.id || (data._id ? data._id.toString() : undefined);

    const userId = typeof data.user_id === 'object' && data.user_id?._id
      ? data.user_id._id.toString()
      : data.user_id?.toString();

    const roomId = typeof data.room_id === 'object' && data.room_id?._id
      ? data.room_id._id.toString()
      : data.room_id?.toString();

    const sender = data.sender || (typeof data.user_id === 'object' ? {
      id: data.user_id._id?.toString(),
      fullName: data.user_id.fullName,
      avatar: data.user_id.avatar
    } : undefined);

    return new ChatEntity({
      id: entityId,
      user_id: userId,
      room_id: roomId,
      content: data.content,
      images: Array.isArray(data.images) ? data.images : [],
      type: data.type,
      status: data.status,
      readBy: Array.isArray(data.readBy) ? data.readBy : [],
      deleted: data.deleted || false,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      sender: sender,
    });
  }

  public static create(data: IChatProps): ChatEntity {

    if (!data.content?.trim() && !data.images?.length) {
      throw new Error("Content or images is required");
    }

    if (!data.user_id || !data.room_id) {
      throw new Error("User ID and Room ID are required");
    }

    return new ChatEntity({
      ...data,
      id: undefined,
      status: "sent",
      readBy: [data.user_id],
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: { id: data.user_id }
    } as IChatProps);
  }

  public getId(): string | undefined { return this.id; }
  public getUserID(): string { return this.user_id; }
  public getRoomID(): string { return this.room_id; }
  public getContent(): string { return this.content; }
  public getImages(): string[] { return this.images; }
  public getType(): string { return this.type; }
  public getStatus(): string { return this.status; }
  public getReadBy(): string[] { return this.readBy; }
  public getCreatedAt(): Date | undefined { return this.createdAt; }
}