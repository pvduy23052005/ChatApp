import jwt from "jsonwebtoken";
import { ITokenService } from "../../application/ports/token.port";

export class TokenService implements ITokenService {
  public async generateToken(payload: any): Promise<string> {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1d" });
  }

  public async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  }
}