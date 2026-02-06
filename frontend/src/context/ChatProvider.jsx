import { useEffect, useRef, useState } from "react";
import { ChatContext } from "./ChatContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { chatServiceAPI } from "../services/chatServiceAPI";
import { socket } from "../socket/index";
import { useAuth } from "../hook/auth/useAuth";

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
    if (user?.id && currentRoomID) {
      socket.emit("CLIENT_READ_ROOM", {
        roomID: currentRoomID,
        userID: user.id,
      });

      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room._id === currentRoomID && room.lastMessage) {
            const oldReadBy = room.lastMessage.readBy || [];
            if (!oldReadBy.includes(user.id)) {
              return {
                ...room,
                lastMessage: {
                  ...room.lastMessage,
                  readBy: [...oldReadBy, user.id], // Thêm mình vào
                },
              };
            }
          }
          return room;
        });
      });
    }
  }, [currentRoomID , user.id]);

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

  // logic real-time last-message .
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

        //
        if (!isMyMessage && openingRoomID === newMessage.room_id) {
          // socket .
          console.log("ok");
          socket.emit("CLIENT_READ_ROOM", {
            roomID: newMessage.room_id,
            userID: myID,
          });
        }
      }
      setRooms((prevRooms) => {
        const roomIndex = prevRooms.findIndex(
          (r) => r._id === newMessage.room_id,
        );

        if (roomIndex === -1) return prevRooms;
        const newRooms = [...prevRooms];

        const roomToUpdate = { ...newRooms[roomIndex] };

        roomToUpdate.lastMessage = {
          content: newMessage.content,
          createdAt: newMessage.createdAt,
          user_id: myID,
          readBy: newMessage.readBy,
        };

        newRooms.splice(roomIndex, 1);
        newRooms.unshift(roomToUpdate);

        return newRooms;
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
