import { chatServiceAPI } from "../../services/chatServiceAPI";
import { socket } from "../../socket";
import { useEffect, useState } from "react";

export const useChatSocket = (roomID) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!roomID) return;

    const handleGetChats = async () => {
      try {
        const res = await chatServiceAPI.getChats(roomID);
        setChats(res.chats || []);
      } catch (error) {
        console.log("Lỗi lấy tin nhắn:", error);
      }
    };

    const handleNewMessage = (newMessage) => {
      if (newMessage.room_id === roomID) {
        setChats((prev) => [...prev, newMessage]);
      }
    };

    handleGetChats();

    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
      setChats([]);
    };

  }, [roomID]); 

  return { chats };
};