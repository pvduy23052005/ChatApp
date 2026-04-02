import type { IFriendProps } from "./type";

export class FriendEntity {
  private id?: string | undefined;
  private userId1: string;
  private userId2: string;
  private roomId: string;
  private createdAt: Date;

  constructor(data: IFriendProps) {
    this.id = data.id?.toString();

    if (!data.userId1 || !data.userId2) {
      throw new Error("Thiếu thông tin bạn bè");
    }

    const [u1, u2] = [data.userId1, data.userId2].sort() as [string, string];
    this.userId1 = u1;
    this.userId2 = u2;
    this.roomId = data.roomId;
    this.createdAt = data.createdAt || new Date();
  }

  public static establish(userId1: string, userId2: string, roomId: string): FriendEntity {

    if (userId1 === userId2) {
      throw new Error("Không thể thiết lập quan hệ bạn bè với chính mình");
    }

    return new FriendEntity({
      userId1,
      userId2,
      roomId,
      createdAt: new Date(),
    });
  }

  public static restore(data: IFriendProps): FriendEntity {
    return new FriendEntity(data);
  }

  public getUserId1(): string { return this.userId1; }
  public getUserId2(): string { return this.userId2; }
  public getRoomId(): string { return this.roomId; }
  public getCreatedAt(): Date { return this.createdAt; }
}