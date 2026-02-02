import ChatMessageFooter from "./ChatMessageFooter";
import ChatMessageGroup from "./ChatMessageGroup";
import { useChatSocket } from "../../hook/socket/useChatSocket";
import EmptyChatState from "../common/EmptyChat";
import ChatHeader from "./ChatHeader";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

function ChatMain() {
  const { currentRoomID, currentRoomInfo } = useContext(ChatContext);
  const { chats, isShowTyping, typingUser } = useChatSocket(currentRoomID);
  return (
    <div className="chat-main-body">
      {currentRoomID ? (
        <>
          <ChatHeader currentRoomInfo={currentRoomInfo} />

          <ChatMessageGroup
            chats={chats}
            isShowTyping={isShowTyping}
            typingUser={typingUser}
          />

          <ChatMessageFooter />
        </>
      ) : (
        <EmptyChatState />
      )}
    </div>
  );
}

export default ChatMain;
