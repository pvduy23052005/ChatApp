import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hook/auth/useAuth";
import { NavLink } from "react-router-dom";

function ChatSider({ rooms }) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentRoomID = searchParams.get("roomId");

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="chat-sider">
      <div className="chat-header">
        <div className="nav-header">
          <NavLink to={"/chat"} end>Tin nhắn</NavLink>
          <NavLink to={"/chat/not-friend"}>Tin nhắn chờ</NavLink>
        </div>
      </div>
      {rooms &&
        rooms.map((room) => {
          const myId = user?._id || user?.id;
          const lastMsg = room.lastMessage || {};
          const isMe = lastMsg.user_id === myId;
          const isRead = !isMe && lastMsg.status === "sent" ? "unread" : "";
          const prefix = isMe ? "Bạn: " : "";
          const messageContent = lastMsg.content
            ? truncateText(lastMsg.content, 15)
            : "Bắt đầu trò chuyện";

          const isActive = currentRoomID === room._id;

          return (
            <Link
              to={`${location.pathname}?roomId=${room._id}`}
              key={room._id}
              className={`box-friend ${isActive ? "active" : ""}`}
              data-user-id={room.otherUserId}
              data-room-id={room._id}
            >
              <img
                src={room.avatar || "/images/default-avatar.webp"}
                alt="Avatar"
              />

              <div className="inner-content">
                <span className="name">{truncateText(room.title, 25)}</span>

                <span className={`last-message ${isRead}`}>
                  {lastMsg.content ? (
                    <>
                      {prefix} {messageContent}
                    </>
                  ) : (
                    "Bắt đầu trò chuyện"
                  )}
                </span>
              </div>

              <div className="inner-status" data-status={room.statusOnline}>
                <i className="fa-solid fa-circle"></i>
              </div>
            </Link>
          );
        })}
    </div>
  );
}

export default ChatSider;
