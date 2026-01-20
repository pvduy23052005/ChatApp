import { useAuth } from "../../hook/auth/useAuth";

function ChatMessageGroup({ chats = [] }) {
  const { user } = useAuth();
  const myId = user?._id || user?.id;

  const lastMessageIndex = chats
    .map((item) => item.user_id?._id?.toString() || "")
    .lastIndexOf(myId?.toString());

  // conver time .
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const checkIsImage = (url) => {
    if (!url) return false;
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };
  const getFileName = (url) => {
    if (!url) return "File";
    return url.split("/").pop().split("?")[0].split(":upload:")[0];
  };

  return (
    <div className="chat-message-body">
      {chats &&
        chats.map((chat, index) => {
          const isSystem =
            chat.content?.includes("đã rời nhóm") ||
            chat.content?.includes("đã thêm") ||
            chat.content?.includes("đã xóa");

          if (isSystem) {
            return (
              <div className="system-message" key={chat._id || index}>
                <span>{chat.content}</span>
              </div>
            );
          }
          const senderId = chat.user_id?._id?.toString();
          const isMe = senderId === myId?.toString();
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
                    {chat.images.map((image, imgIndex) => {
                      if (!image) return null;
                      const isImage = checkIsImage(image);

                      if (isImage) {
                        return (
                          <img
                            key={imgIndex}
                            src={image}
                            alt="preview"
                            className="chat-image-preview"
                          />
                        );
                      } else {
                        return (
                          <a
                            key={imgIndex}
                            href={image}
                            target="_blank"
                            rel="noreferrer"
                            className="file-attachment-box"
                          >
                            <i className="bx bx-file"></i>
                            <span className="file-name">
                              {getFileName(image)}
                            </span>
                          </a>
                        );
                      }
                    })}
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
    </div>
  );
}

export default ChatMessageGroup;
