import { IUserReadRepository, IUserWriteRepository } from "../../ports/repositories/user.port";

export class LogoutUseCase {

  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly userWriteRepo: IUserWriteRepository
  ) { }

  public async execute(userID: string) {
    if (!userID) {
      throw new Error("Không tìm thấy thông tin người dùng");
    }

    const user = await this.userReadRepo.findUserById(userID);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    user.setStatusOnline("offline");

    await this.userWriteRepo.updateProfile(user);
  }
}