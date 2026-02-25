import { Response, Request } from 'express';
import { uploadCloud_util } from '../utils/uploadCloud.util';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "Không có file nào được tải lên.",
      });
    }

    const urls = await uploadCloud_util(files);

    res.status(200).json({
      message: "Upload thành công!",
      urls: urls
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Lỗi hệ thống khi xử lý upload."
    });
  }
}