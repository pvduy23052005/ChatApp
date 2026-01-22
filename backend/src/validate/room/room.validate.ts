import { NextFunction, Response, Request } from 'express';
import Room from "../../models/room.model";


async function roomValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const myID: string = res.locals.user.id.toString();

    const room = await Room.findOne({
      _id: roomID,
      deleted: false
    })

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập phòng hợp lệ"
      });
    }

    const currentMember = room.members.find(
      (member: any) => member.user_id._id.toString() === myID
    )
    
    if (currentMember?.role !== "superAdmin") {
      return res.status(400).json({
        success: false,
        message: "Bạn không có quyền "
      });
    }

    res.locals.room = room;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
}

export default roomValidate;