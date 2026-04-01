import bcrypt from "bcrypt";
import { IPasswordService } from "../../application/ports/password.port";


export class BcryptHashService implements IPasswordService {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}