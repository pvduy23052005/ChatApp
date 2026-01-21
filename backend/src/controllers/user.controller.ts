import { Response, Request } from 'express';
import User from "../models/user.model";

// [get] /users
export const getUsers = async (req: Request, res: Response) => {
  try {

    const myID = res.locals.user.id.toString();

    const listId = [
      myID
    ]

    const users = await User.find({
      _id: { $ne: listId },
      deleted: false
    }).select("fullName avatar");

    res.status(200).json({
      success: true,
      users: users
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}