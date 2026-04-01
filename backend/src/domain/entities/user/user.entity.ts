import { IUserProps } from "./user.type";

export class UserEntity {
  private id: string;
  private fullName: string;
  private email: string;
  private password: string;
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: IUserProps) {
    this.id = data.id.toString();
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.avatar = data.avatar;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public isActive(): boolean {
    return this.status === "active";
  }

  public getProfile(): any {
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
}
