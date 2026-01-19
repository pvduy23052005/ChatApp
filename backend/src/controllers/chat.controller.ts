import { Request, Response } from "express";
import getRoom from "../helper/getRoom.helper";
import getChat from "../helper/getChat.helper";
import getInfoRoom from "../helper/getInfoRoom.helper";
import Room from "../models/room.model";

// [get] /chat/roomId=234435345354345345
export const index = async (req: Request, res: Response) => {
  try {
    const roomId = (req.query.roomId as string) || "";
    let chats: any[] = [];
    let infoRoom: any = null;
    let allRooms: any = [];

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn người mà muốn nhắn tin"
      })
    }

    const room = await Room.findById(roomId);
    console.log(room);

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Phòng không tồn tại"
      })
    }

    [allRooms, chats] = await Promise.all([
      getRoom(res, "accepted"),
      getChat(roomId),
    ]);

    // const objectRoom = await getInfoRoom(req, res);
    // if (objectRoom) {
    //   infoRoom = objectRoom;
    // }

    res.status(400).json({
      message: true,
      listchats: chats,
      allRoom: allRooms
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}