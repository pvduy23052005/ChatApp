import { useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";


function EmojiPickerAttachment({ showEmoji, setShowEmoji, handleEmojiClick }) {
  const emojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowEmoji]);

  return (
    <>
      <div className="emoji-wrapper" ref={emojiRef}>
        {showEmoji && (
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={400}
              searchDisabled={true}
              skinTonesDisabled={true}
              previewConfig={{
                showPreview: false,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EmojiPickerAttachment;
