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
        console.log(error.response.data.message);
      }
    };
    handleGetUsers();
  }, []);

  useEffect(() => {
    const handleReturnRoomID = (data) => {
      const { roomID } = data;
      navigate(`/chat?roomId=${roomID}`);
    };
    socket.on("SERVER_SEND_ROOM_ID", handleReturnRoomID);

    return () => {
      socket.off("SERVER_SEND_ROOM_ID", handleReturnRoomID);
    };
  }, [navigate]);

  return {
    users,
    setUsers,
  };
};
