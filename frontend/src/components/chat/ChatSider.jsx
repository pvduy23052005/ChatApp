import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hook/auth/useAuth";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

function ChatSider() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentRoomID = searchParams.get("roomId");
  const { rooms, onlineUserIDs } = useContext(ChatContext);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="chat-sider">
      <div className="chat-header">
        <div className="nav-header">
          <NavLink to={"/chat"} end>
            Tin nhắn
          </NavLink>
          <NavLink to={"/chat/not-friend"}>Tin nhắn chờ</NavLink>
        </div>
      </div>
      {rooms &&
        rooms.map((room) => {
          const myId = user?._id || user?.id;

          const lastMsg = room.lastMessage || {};
          const isMe = lastMsg.user_id === myId;

          const isRead = room.lastMessage.readBy?.includes(myId);
          const classRead = isRead ? "" : "unread";

          const prefix = isMe ? "Bạn: " : `${user.fullName}:`;
          const messageContent = lastMsg.content
            ? truncateText(lastMsg.content, 10)
            : "Bắt đầu trò chuyện";
          const isOnline = onlineUserIDs.includes(room.otherUserId);
          const isActive = currentRoomID === room._id;

          return (
            <Link
              to={`${location.pathname}?roomId=${room._id}`}
              key={room._id}
              className={`box-friend ${isActive ? "active" : ""}`}
              user_id={room.otherUserId}
            >
              <img
                src={room.avatar || "/images/default-avatar.webp"}
                alt="Avatar"
              />

              <div className="inner-content">
                <span className="name">{truncateText(room.title, 25)}</span>
                <span className={`last-message ${classRead}`}>
                  {lastMsg.content ? (
                    <>
                      {prefix} {messageContent}
                    </>
                  ) : (
                    "Bắt đầu trò chuyện"
                  )}
                </span>
              </div>

              {isOnline && (
                <div className="inner-status" status={room.statusOnline}>
                  <i className="fa-solid fa-circle"></i>
                </div>
              )}
            </Link>
          );
        })}
    </div>
  );
}

export default ChatSider;
