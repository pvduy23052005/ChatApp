import { Request, Response, NextFunction } from 'express';
import { isUserInRoom } from './../../services/room.service';

async function chatValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const roomID = req.params.id?.toString() || "";
    const myID = res.locals.user.id.toString();

    const checkIsUserInRoom = await isUserInRoom(roomID, myID);

    if (!checkIsUserInRoom) {
      return res.status(403).json({
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