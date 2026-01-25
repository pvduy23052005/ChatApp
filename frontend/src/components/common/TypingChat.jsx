import "../../assets/css/typingChat.css";

function TypingChat({ user, showAvatar = true }) {
  return (
    <>
      <div className="typing-indicator-container">
        {showAvatar && (
          <div className="typing-avatar">
            <img
              src={user?.avatar || "/images/default-avatar.webp"}
              alt={user?.fullName || "User"}
            />
          </div>
        )}
        <div className="typing-bubble">
          <div className="typing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </>
  );
}

export default TypingChat;
