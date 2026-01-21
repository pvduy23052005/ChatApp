import { socket } from "../../socket";
import { useEffect , useState } from "react";

export const useChatSocket = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setChats((preview) => [...preview, newMessage]);
    };

    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
    };
  }, []);

  return { chats };
};
