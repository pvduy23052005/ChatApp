import { Request, Response, NextFunction } from 'express';


async function chatValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const roomID: string = req.params.id?.toString() || "";

    if (!roomID) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ID phòng"
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