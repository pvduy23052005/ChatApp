import { useRef, useState } from "react";
import { CiPaperplane } from "react-icons/ci";
import { MdInsertEmoticon } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { chatServiceSocket } from "../../socket/services/chatServiceSocket";
import EmojiPickerAttachment from "../attachments/EmojiPickerAttachment";

function ChatMessageFooter() {
  const [content, setContent] = useState("");
  const inputRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content) {
      inputRef.current.focus();
      return;
    }
    // send message
    chatServiceSocket.sendMessage({
      content: content,
    });
    setContent("");
    setShowEmoji(false);
  };

  return (
    <div className="chat-message-footer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          ref={inputRef}
        />

        {/* Emoji */}
        <EmojiPickerAttachment
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          handleEmojiClick={handleEmojiClick}
        />

        <button
          className="btn button-footer"
          type="button"
          onClick={() => {
            setShowEmoji(!showEmoji);
          }}
        >
          <MdInsertEmoticon />
        </button>
        {/* btn send */}
        <button className="btn button-footer" type="submit">
          <CiPaperplane />
        </button>
      </form>
    </div>
  );
}

export default ChatMessageFooter;
