import ChatMessageFooter from "./ChatMessageFooter";
import ChatMessageGroup from "./ChatMessageGroup";

function ChatMain() {
  return (
    <>
      <div className="chat-main-body">
        <ChatMessageGroup  />
        <ChatMessageFooter />
      </div>
    </>
  );
}

export default ChatMain;
