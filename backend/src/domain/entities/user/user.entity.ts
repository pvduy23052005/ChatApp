import { IUserProps, IUserProfile, IUserRestore } from "./user.type";

export class UserEntity {
  private id: string;
  private fullName: string;
  private email: string;
  private password: string;
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(data: IUserProps) {
    this.id = data.id?.toString() || "";
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.avatar = data.avatar || "";
    this.status = data.status || "offline";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  public isActive(): boolean {
    return this.status === "active";
  }

  public getProfile(): IUserProfile {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      avatar: this.avatar,
      status: this.status
    };
  }

  public getID(): string {
    return this.id;
  }

  public getPassword(): string {
    return this.password;
  }

  public static create(data: IUserProps): UserEntity {
    return new UserEntity({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      id: undefined,
      status: data.status || "offline",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(data: IUserRestore): UserEntity {
    return new UserEntity({
      id: (data.id || data._id)?.toString(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      status: data.statusOnline || data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
