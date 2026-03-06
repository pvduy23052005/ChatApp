import * as userRepository from "../../../infrastructure/database/repositories/user.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (email?: string, password?: string) => {

  if (!email || !password) {
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Email không chính xác");
  }

  const isPasswordMatch: boolean = await bcrypt.compare(password, user.password);

  if (isPasswordMatch === false) {
    throw new Error("Mật khẩu không đúng");
  }

  const payload = { userId: user.id };
  const token = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );

  await userRepository.updateUserStatus(user.id, "online");

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar
    },
    token
  };
}
