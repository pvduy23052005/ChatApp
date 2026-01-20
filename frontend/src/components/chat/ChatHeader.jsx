import { NavLink } from "react-router-dom";

function ChatHeader() {
  return (
    <>
      <div className="chat-header">
        <div className="nav-header">
          <NavLink to={"/chat"}>Tin nhắn</NavLink>
          <NavLink to={"/chat/not-friend"}>Tin nhắn chờ</NavLink>
        </div>
      </div>
    </>
  );
}

export default ChatHeader;
