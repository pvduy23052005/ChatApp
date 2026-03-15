import ChatMessageFooter from "./ChatMessageFooter";
import ChatMessageGroup from "./ChatMessageGroup";
import { useChatSocket } from "../../hook/socket/useChatSocket";
import EmptyChatState from "../common/EmptyChat";
import ChatHeader from "./ChatHeader";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import "../../styles/pages/chat/chatLayout.css";

function ChatMain({ toggleInfo }) {
  const { currentRoomID, currentRoomInfo } = useContext(ChatContext);
  const { 
    chats, 
    isShowTyping, 
    typingUser,
    loadMoreChats,
    hasMore,
    isLoadingMore
  } = useChatSocket(currentRoomID);
  
  return (
    <div className="chat-main-body">
      {currentRoomID ? (
        <>
          <ChatHeader
            currentRoomInfo={currentRoomInfo}
            toggleInfo={toggleInfo}
          />

          <ChatMessageGroup
            chats={chats}
            isShowTyping={isShowTyping}
            typingUser={typingUser}
            onLoadMore={loadMoreChats}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
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
