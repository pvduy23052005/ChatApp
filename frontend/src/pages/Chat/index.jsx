import ChatLayout from "../../layouts/ChatLayout";
import { ChatProvider } from "../../context/ChatProvider";

function Chat() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}

export default Chat;
