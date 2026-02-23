import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import jwt from 'jsonwebtoken';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.cookies?.token || "";

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1] || "";
    }

    if (!token) {
      return res.status(401).json({
        sucess: false,
        message: "vui lòng đăng nhập lại"
      });
    }

    const decoded = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)) as { userId: string }

    const user = await User.findOne({
      _id: decoded.userId,
      deleted: false,
    }).select("fullName friendAccepts friendList friendRequests");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại hoặc đã bị khóa."
      })
    }
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("token");
    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại."
    });
  }
};

export default authMiddleware;
