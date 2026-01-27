import { NextFunction, Response, Request } from 'express';

async function roomActionValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const myID: string = res.locals.user.id.toString();
    const room = res.locals.room;

    const currentMember = room.members.find(
      (member: any) => member.user_id._id.toString() === myID
    )

    if (currentMember?.role !== "superAdmin") {
      return res.status(400).json({
        success: false,
        message: "Bạn không có quyền "
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
}

export default roomActionValidate;