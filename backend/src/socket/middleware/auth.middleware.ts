import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const authSocketMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Authentication error: No cookies found"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication error: Token not found"));
    }

    const decoded = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "token_secret")) as object;

    socket.data.user = decoded;

    next();
  } catch (err: any) {
    console.error("Socket Auth Error:", err.message);
    next(new Error("Unauthorized: Invalid token"));
  }
};