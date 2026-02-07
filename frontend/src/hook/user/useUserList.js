import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { userServiceAPI } from "../../services/userServiceAPI";

export const useUserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleGetUsers = async () => {
      try {
        const res = await userServiceAPI.getUsers();
        setUsers(res.users);
      } catch (error) {
        console.log(error.response.data?.message);
      }
    };
    handleGetUsers();
  }, []);

  useEffect(() => {
    const handleReturnRoomNotFriendID = (data) => {
      const { roomID } = data;
      navigate(`/chat?/not-friend?roomId=${roomID}`);
    };

    const handleReturnRoomFriendID = (data) => {
      const { roomID } = data;
      navigate(`/chat?roomId=${roomID}`);
    };

    // socket
    socket.on("SERVER_SEND_ROOM_NOT_FRIEND_ID", handleReturnRoomNotFriendID);
    socket.on("SERVER_RETURN_ROOM_FRIEND_ID", handleReturnRoomFriendID);

    return () => {
      socket.off("SERVER_SEND_ROOM_ID", handleReturnRoomNotFriendID);
    };
  }, [navigate]);

  return {
    users,
    setUsers,
  };
};
