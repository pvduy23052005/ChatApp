import ChatSdier from "../../components/chat/ChatSider";
import ChatMain from "../../components/chat/ChatMain";
import { chatServiceAPI } from "../../services/chatServiceAPI";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

function Chat() {
  const [rooms, setRooms] = useState([]);
  const [searchParams] = useSearchParams();
  const currentRoomID = searchParams.get("roomId");
  const location = useLocation();

  useEffect(() => {
    const handleGetRooms = async () => {
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
    };
    handleGetRooms();
  }, [location]);

  const currentRoomInfo = rooms.find((room) => room._id === currentRoomID);
  return (
    <>
      <div className="container">
        <div className="chat-main">
          <div className="chat-body">
            <ChatSdier rooms={rooms} />
            <ChatMain
              currentRoomID={currentRoomID}
              currentRoomInfo={currentRoomInfo}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
