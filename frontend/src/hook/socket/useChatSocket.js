import { useNavigate } from "react-router-dom";
import { chatServiceAPI } from "../../services/chatServiceAPI";
import { socket } from "../../socket";
import { useEffect, useRef, useState } from "react";
import { updateSatusMessmasge_util } from "../../utils/room.util";
import { chatServiceSocket } from "../../socket/services/chatServiceSocket";
import { useAuth } from "../auth/useAuth";

export const useChatSocket = (currentRoomID) => {
  const [chats, setChats] = useState([]);
  const typingTimeoutRef = useRef();
  const [typingUser, setTypingUser] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const myID = user?._id || user?.id;

  const loadMoreChats = async () => {
    if (!hasMore || chats.length === 0) return;

    try {
      const cursor = chats[0].id;
      console.log(cursor);
      const res = await chatServiceAPI.getChats(currentRoomID, cursor);

      if (res.success) {
        const olderChats = res.chats || [];

        if (olderChats.length < 10) {
          setHasMore(false);
        }
        setChats((prevChats) => [...olderChats, ...prevChats]);
      }
    } catch (error) {
      console.log("Lỗi tải thêm tin nhắn:", error);
    }
  };

  useEffect(() => {
    if (!currentRoomID) return;

    const fetchInitialChats = async () => {
      try {
        const res = await chatServiceAPI.getChats(currentRoomID);

        if (res.success) {
          const fetchedChats = res.chats || [];
          setChats(fetchedChats);

          if (fetchedChats.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          chatServiceSocket.userReadLastMessage({
            roomID: currentRoomID,
            userID: myID,
          });
        }
      } catch (error) {
        console.log("Lỗi lấy tin nhắn:", error);
        navigate("/chat");
      }
    };

    fetchInitialChats();

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
        chatServiceSocket.userReadLastMessage({
          roomID: currentRoomID,
          userID: myID,
        });
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
    fetchInitialChats();
    // socket.
    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);
    socket.on("SERVER_RETURN_TYPING", handleTyping);
    socket.on("SERVER_RETURN_UPDATE_READ_STATUS", handleUpdateReadMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
      socket.off("SERVER_RETURN_TYPING", handleTyping);
      socket.off("SERVER_RETURN_UPDATE_READ_STATUS", handleUpdateReadMessage);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setChats([]);
      setTypingUser(null);
    };
  }, [currentRoomID, navigate]);

  return {
    chats,
    typingUser,
    isShowTyping: !!typingUser,
    loadMoreChats,
    hasMore,
  };
};
