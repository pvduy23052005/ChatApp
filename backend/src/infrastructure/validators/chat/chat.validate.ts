import { Request, Response, NextFunction } from 'express';

import { RoomReadRepository } from '../../database/repositories/room.repository';

import { IsUserInRoomUseCase } from '../../../application/use-cases/room/actions/is-user-in-room.use-case';

const roomReadRepo = new RoomReadRepository();

async function chatValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const myID: string = res.locals.user.id.toString();

    const isUserInRoomUseCase = new IsUserInRoomUseCase(roomReadRepo);
    const checkIsUserInRoom = await isUserInRoomUseCase.execute(roomID, myID);

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