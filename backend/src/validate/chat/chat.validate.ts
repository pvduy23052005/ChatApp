import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { isUserInRoom } from '../../helper/isUserInRoom.helper';


async function chatValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const roomID = req.params.id?.toString() || "";
    const myID = res.locals.user.id.toString();

    const room = await isUserInRoom(roomID, myID);

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Bạn không có trong cuộc trò chuyện này"
      });
    }

    next()
  } catch (error) {
    console.error("Chat Validate Error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ."
    });
  }
}

export default chatValidate;