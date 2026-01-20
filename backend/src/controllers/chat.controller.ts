import { Request, Response } from "express";
import getRoom from "../helper/getRoom.helper";
import getChat from "../helper/getChat.helper";
import User from "../models/user.model";

// [get] /chat/rooms.
export const getListRoom = async (req: Request, res: Response) => {
  try {
    const myID = res.locals.user._id.toString();

    const existsUser = await User.findOne({
      _id: myID,
      deleted: false
    }).select("_id");

    if (!existsUser) {
      return res.status(400).json({
        success: false,
        message: "Người dùng không tồn tại "
      })
    }

    const rooms = await getRoom(res, "accepted");
    console.log(rooms);
    res.status(200).json({
      success: true,
      rooms: rooms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}