import { Request, Response } from "express";
import getRoom from "../helper/getRoom.helper";
import getChat from "../helper/getChat.helper";
import User from "../models/user.model";
import Room from "../models/room.model";
import mongoose from "mongoose";

// [get] /chat/rooms?status = accepted 
export const getListRoom = async (req: Request, res: Response) => {
  try {
    const stastusRoom: string = req.query.status?.toString() || "";
    let rooms: any = [];

    if (!stastusRoom) {
      return res.status(400).json({
        success: false,
        message: "Chưa chuyền quer query status"
      });
    }

    if (stastusRoom === "accepted") {
      rooms = await getRoom(res, stastusRoom);
    }
    else {
      rooms = await getRoom(res, stastusRoom);
    }


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

// [get] /chat/room/:id . 
export const getListChat = async (req: Request, res: Response) => {
  try {
    const roomID: string = (req.params.id?.toString()) || "";

    if (!mongoose.Types.ObjectId.isValid(roomID)) {
      return res.status(400).json({ message: "ID phòng không đúng định dạng" });
    }

    const existsRoom = await Room.findOne({
      _id: roomID,
      deleted: false
    });

    if (!existsRoom) {
      return res.status(400).json({
        success: false,
        message: "Phòng không tồn tại "
      });
    }

    const chats = await getChat(roomID);

    res.json({
      success: true,
      chats: chats
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }

}