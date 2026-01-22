import { useAuth } from "../../hook/auth/useAuth";
import { useEffect, useRef } from "react";
import { useChatSocket } from "../../hook/socket/useChatSocket";
import { formatTime, isSystemMessage } from "../../utils/chat.utils";
import FileAttachment from "../attachments/FileAttachment";

function ChatMessageGroup() {
  const { user } = useAuth();
  const myID = user?._id || user?.id;
  const scrollTopRef = useRef();
  const { chats } = useChatSocket();

  const lastMessageIndex = chats
    .map((item) => item.user_id?._id?.toString() || "")
    .lastIndexOf(myID?.toString());

  useEffect(() => {
    scrollTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="chat-message-body">
      {chats &&
        chats.map((chat, index) => {
          const isSystem = isSystemMessage(chat.content);

          if (isSystem) {
            return (
              <div className="system-message" key={chat._id || index}>
                <span>{chat.content}</span>
              </div>
            );
          }
          const senderId = chat.user_id?._id?.toString();
          const isMe = senderId === myID?.toString();
          const time = formatTime(chat.createdAt);

          return (
            <div
              key={chat._id || index}
              className={isMe ? "inner-outgoing" : "inner-incoming"}
            >
              {!isMe && (
                <div className="avatar">
                  <img
                    src={chat.user_id?.avatar || "/images/default-avatar.webp"}
                    alt="Avatar"
                  />
                </div>
              )}

              <div className="inner-message">
                {/* name  */}
                {!isMe && <div className="name">{chat.user_id?.fullName}</div>}
                {/* content */}
                {chat.content && <div className="content">{chat.content}</div>}
                {/* image ,file ( pdf .doc ) */}
                {chat.images && chat.images.length > 0 && (
                  <div className="images">
                    <FileAttachment linkFile={chat.images} />
                  </div>
                )}
                {/* Time */}
                <div className="inner-foot">
                  <span className="inner-time">{time}</span>

                  {isMe &&
                    index === lastMessageIndex &&
                    (chat.status === "seen" ? (
                      <span className="chat-status" data-status="seen">
                        Đã xem
                      </span>
                    ) : (
                      <span className="chat-status" data-status="sent">
                        Đã gửi
                      </span>
                    ))}
                </div>
              </div>
            </div>
          );
        })}

      <div ref={scrollTopRef}></div>
    </div>
  );
}

export default ChatMessageGroup;
