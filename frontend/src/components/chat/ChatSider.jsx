import { Link } from "react-router-dom";
import { useAuth } from "../../hook/auth/useAuth";
import { useEffect, useState } from "react";
import { chatServiceAPI } from "../../services/chatServiceAPI";

function ChatSider() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const handleGetRooms = async () => {
      try {
        const res = await chatServiceAPI.getRooms();
        setRooms(res.rooms);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    handleGetRooms();
  }, []);
  return (
    <div className="chat-sider">
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

          return (
            <Link
              to={`/chat?roomId=${room._id}`}
              key={room._id}
              className={`box-friend`}
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
