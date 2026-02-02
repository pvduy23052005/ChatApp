import ChatSdier from "../../components/chat/ChatSider";
import ChatMain from "../../components/chat/ChatMain";
import { ChatProvider } from "../../context/ChatProvider";

function Chat() {
  return (
    <>
      <ChatProvider>
        <div className="container">
          <div className="chat-main">
            <div className="chat-body">
              <ChatSdier />
              <ChatMain />
            </div>
          </div>
        </div>
      </ChatProvider>
    </>
  );
}

export default Chat;
