import { useRef, useState } from "react";
import { CiPaperplane } from "react-icons/ci";
import { MdInsertEmoticon } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { chatServiceSocket } from "../../socket/services/chatServiceSocket";
import EmojiPickerAttachment from "../attachments/EmojiPickerAttachment";
import { useSearchParams } from "react-router-dom";
import PreviewImage from "../attachments/PreviewImageAttachment";
import { uploadFile } from "../../utils/uploadFile.utils";

function ChatMessageFooter() {
  const [content, setContent] = useState("");
  const inputRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchParams] = useSearchParams();
  const currentRoomID = searchParams.get("roomId");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

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

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="chat-message-footer">
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
        <PreviewImage
          files={files}
          setFiles={setFiles}
          inputRef={fileInputRef}
        />

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

        {/* Nút kẹp ghim kích hoạt input file */}
        <label
          className="btn button-footer"
          type="button" // Để type button để tránh submit form nhầm
          htmlFor="preview-image"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleAttachmentClick}
        >
          <CgAttachment />
        </label>

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
