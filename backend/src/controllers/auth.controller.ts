import { Request, Response } from "express"
import User from "../models/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";

// [post] auth/login . 
export const loginPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!email || !password) {
      return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
    }
    if (!user) {
      return res.status(400).json({ error: "Email không chính xác" });

    }
    if (user.password != md5(password)) {
      return res.status(400).json({ error: "Mật khẩu không chính xác" });
    }

    const payload = {
      userId: user.id,
    }

    const token = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "15s"
    })

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