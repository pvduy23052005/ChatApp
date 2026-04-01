import { IPasswordService } from "../../ports/password.port";
import { IUserWriteRepository, IUserReadRepository } from "../../ports/user.port";

export class RegisterUserUseCase {
  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly userWriteRepo: IUserWriteRepository,
    private readonly passwordService: IPasswordService
  ) { }

  public async execute(dataUser: any) {
    const { fullName, email, password, passwordConfirm } = dataUser;

    if (!email || !fullName || !password || !passwordConfirm) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    if (password !== passwordConfirm) {
      throw new Error("Xác nhận mật khẩu không đúng");
    }

    const user = await this.userReadRepo.findUserByEmail(email);
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.userWriteRepo.createUser(fullName, email, hashedPassword);

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
