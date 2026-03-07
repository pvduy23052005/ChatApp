export interface IChatProps {
  id?: string;
  user_id: string;
  room_id: string;
  content?: string;
  images?: string[];
  type?: "user" | "system";
  status?: "sent" | "seen";
  readBy?: string[];
  deleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  sender?: {
    id: string;
    fullName: string;
    avatar?: string;
  };
}

export class ChatEntity {
  private id?: string;
  private user_id: string;
  private room_id: string;
  private content: string;
  private images: string[];
  private type: string;
  private status: string;
  private readBy: string[];
  private deleted: boolean;
  private deletedAt?: Date;
  private createdAt?: Date;
  private updatedAt?: Date;
  private sender?: any;


  constructor(data: IChatProps) {
    this.id = data.id || "";
    this.user_id = data.user_id.toString() || "";
    this.room_id = data.room_id.toString() || "";
    this.content = data.content?.trim() || "";
    this.images = data.images || [];
    this.type = data.type || "user";
    this.status = data.status || "sent";
    this.readBy = data.readBy || [];
    this.deleted = data.deleted || false;
    this.deletedAt = data.deletedAt || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.sender = data.sender;
  }


  public markAsRead(userID: string): void {
    if (!this.readBy.includes(userID)) {
      this.readBy.push(userID);
    }
    this.status = "seen";
  }

  public getDetail() {
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
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      sender: this.sender,
    }
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