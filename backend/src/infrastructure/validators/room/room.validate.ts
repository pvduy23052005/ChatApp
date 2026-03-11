import { Request, Response, NextFunction } from 'express';
import { IsUserInRoomUseCase } from '../../../application/use-cases/room/is-user-in-room.use-case';

import { RoomReadRepository } from '../../database/repositories/room.repository';

const roomReadRepo = new RoomReadRepository();


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

    const isUserInRoomUseCase = new IsUserInRoomUseCase(roomReadRepo);
    const room = await isUserInRoomUseCase.execute(roomID, myID);


    if (!room) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có trong cuộc trò chuyện này"
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