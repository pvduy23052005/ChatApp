import { IUserWriteRepository } from "../../ports/user.port";

export class LogoutUseCase {

  constructor(private readonly userRepository: IUserWriteRepository) { }

  public async execute(userID: string) {
    if (!userID) {
      throw new Error("Không tìm thấy thông tin người dùng");
    }
    await this.userRepository.updateUserStatus(userID, "offline");

  }
}