export class UserEntity {
  private id: string;
  private fullName: string;
  private email: string;
  private password: string;
  private avatar: string;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, fullName: string, email: string, password: string, avatar: string, status: string, createdAt: Date, updatedAt: Date) {
    this.id = id.toString();
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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