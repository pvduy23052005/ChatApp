import { IUserReadRepository , IUserWriteRepository } from "../../ports/user.port";
import { IPasswordService } from "../../ports/password.port";
import { ITokenService } from "../../ports/token.port";

export interface LoginResponse {
  user: any;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly userReadRepo: IUserReadRepository,
    private readonly userWriteRepo: IUserWriteRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
  ) { }

  public async execute(email?: string, password?: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    const user = await this.userReadRepo.findUserByEmail(email);

    if (!user) {
      throw new Error("Email không chính xác");
    }

    if (user.isActive()) {
      throw new Error("Tài khoản đã bị khóa");
    }

    const isPasswordMatch: boolean = await this.passwordService.comparePassword(password, user.getPassword());

    if (!isPasswordMatch) {
      throw new Error("Mật khẩu không đúng");
    }

    const payload = { userId: user.getID() };
    const token = await this.tokenService.generateToken(payload);

    await this.userWriteRepo.updateUserStatus(user.getID(), "online");

    return {
      user: user.getProfile(),
      token
    };
  }
}