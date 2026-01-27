import { useNavigate } from "react-router-dom";
import { chatServiceAPI } from "../../services/chatServiceAPI";
import { socket } from "../../socket";
import { useEffect, useRef, useState } from "react";

export const useChatSocket = (roomID) => {
  const [chats, setChats] = useState([]);
  const typingTimeoutRef = useRef();
  const [typingUser, setTypingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomID) return;

    const handleGetChats = async () => {
      try {
        const res = await chatServiceAPI.getChats(roomID);
        if (res.success) {
          setChats(res.chats || []);
        }
      } catch (error) {
        console.log("Lỗi lấy tin nhắn:", error);
        navigate("/chat");
      }
    };

    const handleTyping = (data) => {
      if (data.roomID !== roomID) return;
      setTypingUser(data);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 3000);
    };

    const handleNewMessage = (newMessage) => {
      if (newMessage.room_id === roomID) {
        setChats((prev) => [...prev, newMessage]);
      }
    };
    handleGetChats();

    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);
    socket.on("SERVER_RETURN_TYPING", handleTyping);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
      socket.off("SERVER_RETURN_TYPING", handleTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setChats([]);
      setTypingUser(null);
    };
  }, [roomID, navigate]);

  return {
    chats,
    typingUser,
    isShowTyping: !!typingUser,
  };
};
