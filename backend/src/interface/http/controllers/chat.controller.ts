import { Request, Response } from "express";

import * as roomUseCase from "../../../application/use-cases/room";
import { GetChatHistoryUseCase } from "../../../application/use-cases/chat/get-chat-history.use-case";

import { ChatRepository } from "../../../infrastructure/database/repositories/chat.repository";

const chatRepository = new ChatRepository();

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

    const getChatHistoryUseCase = new GetChatHistoryUseCase(chatRepository);
    const chats = await getChatHistoryUseCase.execute(roomID);

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
