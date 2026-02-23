import Chat from "../models/chat.model"

export const getMessageByRoomID = async (roomID: string) => {
  const query: any = {
    room_id: roomID,
    deleted: false,
  }

  const messages = await Chat.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: "user_id",
      select: "fullName avatar"
    });

  return messages.reverse();
}