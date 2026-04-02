import { IUserReadRepository, IUserWriteRepository } from "../../ports/user.port";
import { IUpdateProfile, IUserProfile } from "../../../domain/user/entities/user.type";

export class EditProfileUseCase {

  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly userWriteRepo: IUserWriteRepository
  ) { };

  public async execute(userID: string, data: IUpdateProfile): Promise<IUserProfile> {
    const user = await this.userReadRepo.findUserById(userID);

    if (!user) {
      throw new Error("Không tìm thấy người dùng!");
    }

    user.updateProfile(data);

    const updatedUser = await this.userWriteRepo.updateProfile(user);

    if (!updatedUser) {
      throw new Error("Cập nhật thất bại!");
    }

    return updatedUser.getProfile();
  }
}
