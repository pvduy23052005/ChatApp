import { useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { chatServiceAPI } from "../services/chatServiceAPI";
import { socket } from "../socket/index";

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [onlineUserIDs, setOnlineUserIDs] = useState([]);

  // current room id  .
  const currentRoomID = searchParams.get("roomId");
  const currentRoomInfo = rooms.find((room) => room._id === currentRoomID);

  // online status .
  useEffect(() => {
    const handleRoomStatus = ({ userID, status }) => {
      setOnlineUserIDs((prev) => {
        if (status === "online") {
          return prev.includes(userID) ? prev : [...prev, userID];
        } else {
          return prev.filter((id) => id != userID);
        }
      });
    };

    socket.on("SERVER_RETURN_ROOM_STATUS", handleRoomStatus);
    return () => {
      socket.off("SERVER_RETURN_ROOM_STATUS", handleRoomStatus);
    };
  }, []);

  useEffect(() => {
    const handleGetRooms = async () => {
      setIsLoading(true);
      try {
        let res = [];
        if (location.pathname.includes("/not-friend")) {
          res = await chatServiceAPI.getRoomWaitings();
        } else {
          res = await chatServiceAPI.getRoomAcceptes();
        }
        setRooms(res.rooms);
        const listUserOnlines = res.rooms
          .filter((room) => room.statusOnline === "online")
          .map((room) => room.otherUserId);
        setOnlineUserIDs(listUserOnlines);
      } catch (error) {
        console.log(error.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    handleGetRooms();
  }, [location.pathname]);

  return (
    <ChatContext.Provider
      value={{
        rooms,
        currentRoomID,
        currentRoomInfo,
        isLoading,
        onlineUserIDs,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
