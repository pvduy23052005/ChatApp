import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userServiceAPI } from "../../services/userServiceAPI";
import { roomServiceAPI } from "../../services/roomServiceAPI";
import "../../assets/css/room/create.css";

function Create() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [titleRoom, setTitleRoom] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGetFriends = async () => {
      try {
        const res = await userServiceAPI.getFriends();
        setFriends(res.friends || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách bạn bè:", error);
      }
    };
    handleGetFriends();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titleRoom.trim()) {
      alert("Vui lòng nhập tên phòng!");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thành viên!");
      return;
    }

    try {
      setLoading(true);

      const dataPayload = {
        titleRoom: titleRoom,
        members: selectedMembers,
      };

      const res = await roomServiceAPI.create(dataPayload);
      if (res.success) {
        alert("Tạo phòng thành công!");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Lỗi tạo phòng:", error);
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-container">
      <div className="create-card">
        <h2 className="page-title">Tạo phòng chat nhóm</h2>

        <form onSubmit={handleSubmit}>
          {/* Ô nhập tên phòng */}
          <div className="form-group">
            <label className="label">Tên phòng nhóm</label>
            <input
              type="text"
              className="input-text"
              placeholder="Ví dụ: Team Dev, Gia đình..."
              value={titleRoom}
              onChange={(e) => setTitleRoom(e.target.value)}
            />
          </div>

          {/* Danh sách bạn bè */}
          <div className="form-group">
            <label className="label">
              Chọn thành viên ({selectedMembers.length})
            </label>

            <div className="friends-grid">
              {friends && friends.length > 0 ? (
                friends.map((friend) => (
                  <label
                    key={friend._id}
                    className={`friend-item ${selectedMembers.includes(friend._id) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="hidden-checkbox"
                      checked={selectedMembers.includes(friend._id)}
                      onChange={() => handleCheckboxChange(friend._id)}
                    />

                    <div className="friend-avatar">
                      <img
                        src={friend.avatar || "/images/default-avatar.webp"}
                        alt={friend.fullName}
                      />
                    </div>

                    <div className="friend-info">
                      <div className="friend-name">{friend.fullName}</div>
                    </div>

                    {/* Icon check hiện lên khi chọn */}
                    <div className="check-icon">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                  </label>
                ))
              ) : (
                <p className="no-friends">Bạn chưa có bạn bè nào để thêm.</p>
              )}
            </div>
          </div>

          {/* Nút Submit */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo nhóm ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create;
