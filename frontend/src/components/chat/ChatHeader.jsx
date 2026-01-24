import { Link } from "react-router-dom";

function ChatHeader({ currentRoomInfo }) {
  if (!currentRoomInfo) {
    return (
      <div className="chat-header loading">
        <span>Đang tải thông tin...</span>
        <style>{`
          .chat-header.loading {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            background-color: #fff;
            border-bottom: 1px solid #e0e0e0;
            color: #888;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  const avatar = currentRoomInfo.avatar || "https://placehold.co/50x50";
  const name =
    currentRoomInfo.title || currentRoomInfo.fullName || "Người dùng";
  const isOnline =
    currentRoomInfo.statusOnline === "online" || currentRoomInfo.isOnline;

  return (
    <>
      <Link to={`room/detail/${currentRoomInfo._id}`}>
        <div className="chat-header">
          <style>{`
        .chat-header {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background-color: #fff; /* Bạn có thể đổi lại từ màu red nếu muốn */
          border-bottom: 1px solid #e0e0e0;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .avatar-wrapper img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;

        }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background-color: #2ecc71;
          border: 1px solid #fff;
          border-radius: 50%;
        }

        .header-currentRoomInfo {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .user-status {
          margin: 0;
          font-size: 12px;
          color: #fff;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn-icon {
          background: none;
          border: none;
          font-size: 18px;
          color: #0084ff;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .btn-icon:hover {
          background-color: #f0f2f5;
        }
      `}</style>

          <div className="header-left">
            <div className="avatar-wrapper">
              <img src={avatar} alt={name} />
              {isOnline && <span className="status-dot"></span>}
            </div>

            <div className="header-currentRoomInfo">
              <h3 className="user-name">{name}</h3>
              <p className="user-status">
                {isOnline ? "Đang hoạt động" : "Truy cập gần đây"}
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn-icon">
              <i className="fa-solid fa-phone"></i>
            </button>
            <button className="btn-icon">
              <i className="fa-solid fa-video"></i>
            </button>
            <button className="btn-icon">
              <i className="fa-solid fa-circle-info"></i>
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}

export default ChatHeader;
