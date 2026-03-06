import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class LogoutUseCase {

  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userID: string) {
    if (!userID) {
      throw new Error("Không tìm thấy thông tin người dùng");
    }
    await this.userRepository.updateUserStatus(userID, "offline");

  }
}