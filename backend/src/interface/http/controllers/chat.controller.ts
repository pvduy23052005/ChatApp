import { Request, Response } from "express";
import * as chatUseCase from "../../../application/use-cases/chat";
import * as roomUseCase from "../../../application/use-cases/room";

// [get] /chat/rooms?status = accepted || waiting 
export const getListRoom = async (req: Request, res: Response) => {
  try {
    const statusRoom: string = req.query.status?.toString() || "";
    const myID: string = res.locals.user.id?.toString();

    const rooms = await roomUseCase.getRoom(myID, statusRoom);

    res.status(200).json({
      success: true,
      rooms: rooms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}

// [get] /chat/room/:id . 
export const getListChat = async (req: Request, res: Response) => {
  try {
    const roomID: string = (req.params.id?.toString()) || "";

    const chats = await chatUseCase.getChatHistory(roomID);

    res.json({
      success: true,
      chats: chats
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }

}
