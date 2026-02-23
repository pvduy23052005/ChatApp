import { Request, Response } from "express"
import * as authService from "../services/auth.service";

// [post] auth/login . 
export const loginPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const { user, token } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    // socket .
    _io.emit("SERVER_RETURN_ROOM_STATUS", {
      userID: user.id,
      status: "online"
    });

    res.status(200).json({
      success: true,
      user: user,
      token: token
    })

  } catch (error: any) {
    console.log("error loginpost:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}

// [post] auth/login . 
export const logoutPost = async (req: Request, res: Response) => {
  try {
    const { myID } = req.body;

    res.clearCookie("token");

    const check: boolean = await authService.logout(myID);

    // socket .
    _io.emit("SERVER_RETURN_ROOM_STATUS", {
      userID: myID,
      status: "offline"
    });

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công!"
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi hệ thống "
    });
  }
}

// [post] auth/register . 
export const registerPost = async (req: Request, res: Response) => {
  try {

    let { email, password, fullName, passwordConfirm } = req.body;

    const dataUser = {
      fullName: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      passwordConfirm: passwordConfirm.trim(),
    };

    const newUser = await authService.registerUser(dataUser)

    res.status(201).json({
      success: true,
      dataUser: newUser
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi đăng xuất"
    });
  }
}