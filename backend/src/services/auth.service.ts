import * as userRepository from "../repositories/user.repository";
import md5 from "md5";
import jwt from "jsonwebtoken";

export const login = async (email?: string, password?: string) => {

  if (!email || !password) {
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Email không chính xác");
  }

  if (user.password !== md5(password)) {
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

export const logout = async (userID: string) => {
  if (!userID) {
    throw new Error("Không tìm thấy thông tin người dùng");
  }

  await userRepository.updateUserStatus(userID, "offline");

  return true;
}

export const registerUser = async (dataUser: any) => {
  let { fullName, email, password, passwordConfirm } = dataUser;

  console.log(dataUser);
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

  password = md5(password);

  const newUser = await userRepository.createUser(fullName, email, password);

  if (!newUser) {
    throw new Error("Đăng ký thất bại");
  }

  return {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
  };
}