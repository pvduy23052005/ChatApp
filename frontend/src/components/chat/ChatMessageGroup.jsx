import { useAuth } from "../../hook/auth/useAuth";
import { useEffect, useRef } from "react";
import { formatTime } from "../../utils/chat.utils";
import FileAttachment from "../attachments/FileAttachment";
import TypingChat from "../common/TypingChat";
import "../../styles/pages/chat/chatMessages.css";

function ChatMessageGroup({ chats, isShowTyping, typingUser }) {
  const { user } = useAuth();
  const myID = user?._id || user?.id;
  const scrollTopRef = useRef();

  useEffect(() => {
    scrollTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isShowTyping]);

  return (
    <div className="chat-message-body">
      {chats &&
        chats.map((chat, index) => {
          const isSystem = chat.type === "system";

          if (isSystem) {
            return (
              <div className="system-message" key={chat._id || index}>
                <span>{chat.content}</span>
              </div>
            );
          }

          const sender = chat.user_id;
          const senderId = sender?._id?.toString();
          const isMe = senderId === myID?.toString();
          const time = formatTime(chat.createdAt);
          const isSeen = chat.readBy?.length > 1;

          // Grouping Logic
          const nextChat = chats[index + 1];
          const isLastInGroup =
            !nextChat ||
            nextChat.type === "system" ||
            nextChat.user_id?._id?.toString() !== senderId;

          return (
            <div
              key={chat._id || index}
              className={`message-row ${isMe ? "outgoing" : "incoming"} ${
                isLastInGroup ? "last-in-group" : ""
              }`}
            >
              {!isMe && (
                <div className="message-avatar">
                  {isLastInGroup ? (
                    <img
                      src={sender?.avatar || "/images/default-avatar.webp"}
                      alt="Avatar"
                      title={sender?.fullName}
                    />
                  ) : (
                    <div className="avatar-placeholder" />
                  )}
                </div>
              )}

              <div className="message-content-wrapper">

                <div className="message-bubble">
                  {chat.content && <p className="text">{chat.content}</p>}

                  {chat.images && chat.images.length > 0 && (
                    <div className="message-images">
                      <FileAttachment linkFile={chat.images} />
                    </div>
                  )}
                </div>

                {isLastInGroup && (
                  <div className="message-meta">
                    <span className="timestamp">{time}</span>
                    {isMe && (
                      <span className={`status ${isSeen ? "seen" : "sent"}`}>
                        {isSeen ? "Đã xem" : "Đã gửi"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      {isShowTyping && <TypingChat user={typingUser} />}
      <div ref={scrollTopRef}></div>
    </div>
  );
}

export default ChatMessageGroup;
