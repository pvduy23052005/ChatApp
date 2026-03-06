import { IUserRepository } from "../../../domain/interfaces/user.interface";

export class EditProfileUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userID: string, data: any) {
    const { fullName, avatar } = data;

    if (!userID) {
      throw new Error("Không tìm thấy người dùng!");
    }

    const updateData: any = {};

    if (fullName) {
      updateData.fullName = fullName;
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("Không có dữ liệu cập nhật!");
    }

    const user = await this.userRepository.updateProfile(userID, updateData);

    if (!user) {
      throw new Error("Cập nhật thất bại!");
    }

    return user;
  }
}
