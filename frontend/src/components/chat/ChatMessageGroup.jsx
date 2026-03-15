import { useAuth } from "../../hook/auth/useAuth";
import { useEffect, useRef, useLayoutEffect } from "react";
import { formatTime } from "../../utils/chat.utils";
import FileAttachment from "../attachments/FileAttachment";
import TypingChat from "../common/TypingChat";
import "../../styles/pages/chat/chatMessages.css";

function ChatMessageGroup({
  chats,
  isShowTyping,
  typingUser,
  onLoadMore,
  hasMore,
}) {
  const { user } = useAuth();
  const myID = user?._id || user?.id;

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const oldScrollHeightRef = useRef(0);
  const isFetchingOldRef = useRef(false);

  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop === 0 && hasMore) {
      isFetchingOldRef.current = true;
      oldScrollHeightRef.current = e.currentTarget.scrollHeight;
      if (onLoadMore) {
        onLoadMore();
      }
    }
  };


  useLayoutEffect(() => {
    if (isFetchingOldRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop =
        newScrollHeight - oldScrollHeightRef.current;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  useEffect(() => {
    if (isShowTyping) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isShowTyping]);

  return (
    <div
      className="chat-message-body"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {chats &&
        chats.map((chat, index) => {
          const isSystem = chat.type === "system";

          if (isSystem) {
            return (
              <div className="system-message" key={chat.id || index}>
                <span>{chat.content}</span>
              </div>
            );
          }

          const sender = chat.sender;
          const senderId = sender?.id?.toString();
          const isMe = senderId === myID?.toString();
          const time = formatTime(chat.createdAt);
          const isSeen = chat.readBy?.length > 1;

          // Grouping Logic
          const nextChat = chats[index + 1];
          const isLastInGroup =
            !nextChat ||
            nextChat.type === "system" ||
            nextChat.sender?.id?.toString() !== senderId;

          return (
            <div
              key={chat.id || index}
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

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatMessageGroup;
