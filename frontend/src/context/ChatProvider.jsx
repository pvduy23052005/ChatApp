import { useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { chatServiceAPI } from "../services/chatServiceAPI";

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // current room id  .
  const currentRoomID = searchParams.get("roomId");

  const currentRoomInfo = rooms.find((room) => room._id === currentRoomID);
  
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
      } catch (error) {
        console.log(error.response.data.message);
      }
      setIsLoading(false);
    };
    handleGetRooms();
  }, [location.pathname]);

  return (
    <ChatContext.Provider
      value={{ rooms, currentRoomID, currentRoomInfo, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
