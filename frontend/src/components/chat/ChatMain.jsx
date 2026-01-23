import ChatMessageFooter from "./ChatMessageFooter";
import ChatMessageGroup from "./ChatMessageGroup";
import { useSearchParams } from "react-router-dom";
import { useChatSocket } from "../../hook/socket/useChatSocket";
import EmptyChatState from "../common/EmptyChat";

function ChatMain() {
  const [searchParams] = useSearchParams();
  const roomID = searchParams.get("roomId");
  const { chats } = useChatSocket(roomID);

  return (
    <>
      <div className="chat-main-body">
        {roomID ? (
          <>
            <ChatMessageGroup chats={chats} />
            <ChatMessageFooter />
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>
    </>
  );
}

export default ChatMain;
