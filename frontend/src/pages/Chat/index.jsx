import ChatSdier from "../../components/chat/ChatSider";
import ChatMain from "../../components/chat/ChatMain";
import { chatServiceAPI } from "../../services/chatServiceAPI";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Chat() {
  const [rooms, setRooms] = useState([]);
  const [searchParams] = useSearchParams();
  const currentRoomID = searchParams.get("roomId");

  useEffect(() => {
    const handleGetRooms = async () => {
      try {
        const res = await chatServiceAPI.getRooms();
        setRooms(res.rooms);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    handleGetRooms();
  }, []);

  const currentRoomInfo = rooms.find((room) => room._id === currentRoomID);
  return (
    <>
      <div className="container">
        <div className="chat-main">
          <div className="chat-body">
            <ChatSdier rooms={rooms} />
            <ChatMain currentRoomID={currentRoomID} currentRoomInfo = {currentRoomInfo} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
