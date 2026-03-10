import { IUserWriteRepository } from "../../../domain/interfaces/user.interface";

export class EditProfileUseCase {

  constructor(private readonly userReadRepo: IUserWriteRepository) { };

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

    const user = await this.userReadRepo.updateProfile(userID, updateData);

    if (!user) {
      throw new Error("Cập nhật thất bại!");
    }

    return user;
  }
}
