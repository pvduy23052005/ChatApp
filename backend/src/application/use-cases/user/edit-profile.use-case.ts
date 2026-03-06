import * as userRepository from "../../../infrastructure/database/repositories/user.repository";

export const editProfile = async (userID: string, data: any) => {
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

  const user = await userRepository.updateProfile(userID, updateData);

  if (!user) {
    throw new Error("Cập nhật thất bại!");
  }

  return user;
}
