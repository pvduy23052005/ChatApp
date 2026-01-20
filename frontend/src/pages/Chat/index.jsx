import ChatHeader from "../../components/chat/ChatHeader";
import ChatSdier from "../../components/chat/ChatSider";
import ChatMain from "../../components/chat/ChatMain";

function Chat() {
  return (
    <>
      <div className="container">
        <div className="chat-main">
          <ChatHeader />
          <div className="chat-body">
            <ChatSdier />
            <ChatMain />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
