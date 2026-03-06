import * as userRepository from "../../../infrastructure/database/repositories/user.repository";

export const logout = async (userID: string) => {
  if (!userID) {
    throw new Error("Không tìm thấy thông tin người dùng");
  }

  await userRepository.updateUserStatus(userID, "offline");

  return true;
}
