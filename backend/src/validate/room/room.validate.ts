import { Request, Response, NextFunction } from 'express';
import { isUserInRoom } from '../../helper/isUserInRoom.helper';

async function roomValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const myID: string = res.locals.user.id.toString()

    if (!roomID) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập phòng hợp lệ"
      });
    }

    const room = await isUserInRoom(roomID, myID);

    if (!room) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập phòng chat này."
      });
    }

    res.locals.room = room;
    next();
  } catch (error) {
    console.error("Room Validate Error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ."
    });
  }
}

export default roomValidate;