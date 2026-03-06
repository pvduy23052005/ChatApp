import * as userRepository from "../../../infrastructure/database/repositories/user.repository";
import bcrypt from "bcrypt";

export const registerUser = async (dataUser: any) => {
  const { fullName, email, password, passwordConfirm } = dataUser;

  if (!email || !fullName || !password || !passwordConfirm) {
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  if (password !== passwordConfirm) {
    throw new Error("Xác nhận mật khẩu không đúng");
  }

  const user = await userRepository.findUserByEmail(email);
  if (user) {
    throw new Error("Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser(fullName, email, hashedPassword);

  if (!newUser) {
    throw new Error("Đăng ký thất bại");
  }

  return {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
  };
}
