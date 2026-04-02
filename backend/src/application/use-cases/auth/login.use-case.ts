import { IUserReadRepository, IUserWriteRepository } from "../../ports/repositories/user.port";
import { IPasswordService } from "../../ports/services/password.port";
import { ITokenService } from "../../ports/services/token.port";

import { IUserProfile } from "../../../domain/user/type";

export interface LoginResponse {
  user: IUserProfile;
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

    const isPasswordMatch: boolean = await this.passwordService.comparePassword(password, user.getPassword());

    if (!isPasswordMatch) {
      throw new Error("Mật khẩu không đúng");
    }

    user.setStatusOnline("online");
    await this.userWriteRepo.updateProfile(user);

    const payload = { userId: user.getID() };
    const token = await this.tokenService.generateToken(payload);

    return {
      user: user.getProfile(),
      token
    };
  }
}