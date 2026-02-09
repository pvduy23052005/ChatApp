import { useEffect, useRef, useState } from "react";
import { ChatContext } from "./ChatContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { chatServiceAPI } from "../services/chatServiceAPI";
import { socket } from "../socket/index";
import { useAuth } from "../hook/auth/useAuth";
import {
  markRoomRead_util,
  updateLastMessageAndReorder_util,
} from "../utils/room.util";
import { chatServiceSocket } from "../socket/services/chatServiceSocket";

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [onlineUserIDs, setOnlineUserIDs] = useState([]);
  const { user } = useAuth();

  // current room id  .
  const currentRoomID = searchParams.get("roomId");
  const currentRoomInfo = rooms.find((room) => room._id === currentRoomID);

  const currentRoomIDRef = useRef(currentRoomID);
  const userRef = useRef(user);

  useEffect(() => {
    currentRoomIDRef.current = currentRoomID;
  }, [currentRoomID]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (user.id && currentRoomID) {
      // socket
      chatServiceSocket.userReadLastMessage({
        roomID: currentRoomID,
        userID: user.id,
      });

      setRooms((prevRooms) => {
        const newListRooms = markRoomRead_util(
          prevRooms,
          currentRoomID,
          user.id,
        );
        return newListRooms;
      });
    }
  }, [currentRoomID, user.id]);

  // online status .
  useEffect(() => {
    const handleRoomStatus = ({ userID, status }) => {
      setOnlineUserIDs((currentOnlineIDs) => {
        if (status === "online") {
          return currentOnlineIDs.includes(userID)
            ? currentOnlineIDs
            : [...currentOnlineIDs, userID];
        } else {
          return currentOnlineIDs.filter((id) => id != userID);
        }
      });
    };

    socket.on("SERVER_RETURN_ROOM_STATUS", handleRoomStatus);
    return () => {
      socket.off("SERVER_RETURN_ROOM_STATUS", handleRoomStatus);
    };
  }, []);

  // fetch room
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

  // real-time view last-message .
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const openingRoomID = currentRoomIDRef.current;
      const currentUser = userRef.current;
      const myID = currentUser.id;
      const isMyMessage = newMessage.user_id._id.toString() === myID;

      if (isMyMessage || openingRoomID === newMessage.room_id) {
        if (!newMessage.readBy.includes(myID)) {
          newMessage.readBy.push(myID);
        }

        console.log(myID);
        console.log(newMessage);
        

        if (!isMyMessage && openingRoomID === newMessage.room_id) {
          // socket .
          chatServiceSocket.userReadLastMessage({
            roomID: openingRoomID,
            userID: myID,
          });
        }
      }
      setRooms((prevRooms) => {
        const newListRooms = updateLastMessageAndReorder_util(
          prevRooms,
          newMessage,
          myID,
        );
        return newListRooms;
      });
    };

    // socket on .
    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
    };
  }, []);

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
