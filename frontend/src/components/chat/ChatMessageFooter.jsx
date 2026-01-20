import { useState } from "react";
import { CiPaperplane } from "react-icons/ci";
import { MdInsertEmoticon } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { chatServiceSocket } from "../../socket/services/chatServiceSocket";

function ChatMessageFooter() {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    chatServiceSocket.sendMessage({
      contents: content,
    });
    setContent("");
  };

  return (
    <div className="chat-message-footer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="btn button-footer">
          <MdInsertEmoticon />
        </button>
        {/* Nút gửi */}
        <button className="btn button-footer" type="submit">
          <CiPaperplane />
        </button>
      </form>
    </div>
  );
}

export default ChatMessageFooter;
