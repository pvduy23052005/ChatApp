import { useNavigate } from "react-router-dom";
import { chatServiceAPI } from "../../services/chatServiceAPI";
import { socket } from "../../socket";
import { useEffect, useRef, useState } from "react";
import { updateSatusMessmasge_util } from "../../utils/room.util";

export const useChatSocket = (currentRoomID) => {
  const [chats, setChats] = useState([]);
  const typingTimeoutRef = useRef();
  const [typingUser, setTypingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentRoomID) return;

    const handleGetChats = async () => {
      try {
        const res = await chatServiceAPI.getChats(currentRoomID);
        if (res.success) {
          setChats(res.chats || []);
        }
      } catch (error) {
        console.log("Lỗi lấy tin nhắn:", error);
        navigate("/chat");
      }
    };

    const handleTyping = (data) => {
      if (data.roomID !== currentRoomID) return;
      setTypingUser(data);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 3000);
    };

    const handleNewMessage = (newMessage) => {
      if (newMessage.room_id === currentRoomID) {
        setChats((prev) => [...prev, newMessage]);
      }
    };

    const handleUpdateReadMessage = (data) => {
      const { roomID, userID } = data;
      if (roomID === currentRoomID) {
        setChats((prevListMessage) => {
          // userID is my id .
          const newListMessages = updateSatusMessmasge_util(
            prevListMessage,
            userID,
          );
          return newListMessages;
        });
      }
    };
    // fetch api
    handleGetChats();

    // socket.
    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);
    socket.on("SERVER_RETURN_TYPING", handleTyping);
    socket.on("SERVER_RETURN_UPDATE_READ_STATUS", handleUpdateReadMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
      socket.off("SERVER_RETURN_TYPING", handleTyping);
      socket.off("SERVER_UPDATE_READ_STATUS", handleUpdateReadMessage);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setChats([]);
      setTypingUser(null);
    };
  }, [currentRoomID, navigate]);

  return {
    chats,
    typingUser,
    isShowTyping: !!typingUser,
  };
};
