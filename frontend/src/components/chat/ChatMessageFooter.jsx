import { useRef, useState } from "react";
import { CiPaperplane } from "react-icons/ci";
import { MdInsertEmoticon } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { chatServiceSocket } from "../../socket/services/chatServiceSocket";
import EmojiPickerAttachment from "../attachments/EmojiPickerAttachment";
import { useSearchParams } from "react-router-dom";
import PreviewImage from "../attachments/PreviewImageAttachment";
import { uploadFile } from "../../utils/uploadFile.utils";
import { useAuth } from "../../hook/auth/useAuth";
import "../../styles/pages/chat/chatFooter.css";

function ChatMessageFooter() {
  const [content, setContent] = useState("");
  const inputRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchParams] = useSearchParams();
  const currentRoomID = searchParams.get("roomId");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();
  const { user } = useAuth();

  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && files.length === 0) {
      inputRef.current.focus();
      return;
    }

    const urls = await uploadFile(files);
    chatServiceSocket.sendMessage({
      content: content,
      roomID: currentRoomID,
      images: urls,
    });

    setContent("");
    setFiles([]);
    setShowEmoji(false);
  };

  const handleInputChange = (e) => {
    setContent(e.target.value);

    chatServiceSocket.sendTyping({
      roomID: currentRoomID,
      isShow: true,
      user_id: user?.id.toString(),
      avatar: user?.avatar,
      fullName: user?.fullName,
    });
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="chat-message-footer">
      <form onSubmit={handleSubmit} className="chat-footer-form">
        <PreviewImage
          files={files}
          setFiles={setFiles}
          inputRef={fileInputRef}
        />

        <div className="chat-input-wrapper">
          <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={handleInputChange}
            ref={inputRef}
          />

          {/* Action Buttons Grouped Inside Input */}
          <div className="input-actions-group">
            <button
              className="input-action-btn"
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              title="Insert Emoji"
            >
              <MdInsertEmoticon size={22} />
            </button>

            <label
              className="input-action-btn"
              htmlFor="preview-image"
              title="Attach File"
              onClick={handleAttachmentClick}
            >
              <CgAttachment size={22} />
            </label>

            <button
              className="input-action-btn send-btn"
              type="submit"
              title="Send"
            >
              <CiPaperplane size={20} />
            </button>
          </div>

          {/* Emoji Picker */}
          <EmojiPickerAttachment
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
            handleEmojiClick={handleEmojiClick}
          />
        </div>
      </form>
    </div>
  );
}

export default ChatMessageFooter;
