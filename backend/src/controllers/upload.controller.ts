import { Response, Request } from 'express';
import { uploadCloud } from '../helper/uploadCloud.helper';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const files = req.files

    if (!files || files.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Không có file nào được tải lên.",
      });
    }

    const urls = await uploadCloud(files);

    res.status(200).json({
      code: 200,
      message: "Upload thành công!",
      urls: urls
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống khi xử lý upload."
    });
  }
}