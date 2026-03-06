import { IUserRepository } from "../../../domain/interfaces/user.interface";
import bcrypt from "bcrypt";

export class RegisterUserUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(dataUser: any) {
    const { fullName, email, password, passwordConfirm } = dataUser;

    if (!email || !fullName || !password || !passwordConfirm) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    if (password !== passwordConfirm) {
      throw new Error("Xác nhận mật khẩu không đúng");
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.createUser(fullName, email, hashedPassword);

    if (!newUser) {
      throw new Error("Đăng ký thất bại");
    }

    const profile = newUser.getProfile();

    return {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
    };
  }
}
