import { Request, Response } from "express"
import User from "../models/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";

// [post] auth/login . 
export const loginPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin"
      });
    }

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email không chính xác"
      });
    }

    if (user.password != md5(password)) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không đúng"
      });
    }

    const payload = {
      userId: user.id,
    }

    const token = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "1d"
    })

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      },
      token: token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}

// [post] auth/login . 
export const logoutPost = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" // Hoặc "lax" tùy setting lúc login
    });

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi đăng xuất"
    });
  }
}