import ChatMain from "../components/chat/ChatMain";
import ChatSider from "../components/chat/ChatSider";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import "../styles/pages/chat/chatLayout.css";

const ChatLayout = () => {
  const { currentRoomID } = useContext(ChatContext);

  return (
    <div className="chat-layout">
      {/* 1. Left Sidebar: Conversation List */}
      <ChatSider />

      {/* 2. Main Chat Area */}
      <main className="chat-main-area">
        <ChatMain/>
      </main>
    </div>
  );
};

export default ChatLayout;
