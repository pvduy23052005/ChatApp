import { useState } from "react";
import { toast } from "react-toastify";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useRoomDetail } from "../../hook/room/useRoomDetail";
import { useRoomAction } from "../../hook/room/useRoomAction";

function AddMember() {
  const [selectedFriends, setSelectedFriends] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { friends } = useRoomDetail(id);
  const availableFriends = friends;
  const { addMember } = useRoomAction();

  if (!availableFriends) return null;

  const handleToggleFriend = (friend) => {
    setSelectedFriends((prev) => {
      const exists = prev.some((item) => item._id === friend._id);

      if (exists) {
        return prev.filter((item) => item._id !== friend._id);
      } else {
        return [...prev, { _id: friend._id, fullName: friend.fullName }];
      }
    });
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 người bạn!");
      return;
    }
    try {
      setIsAdding(true);

      const listIDs = selectedFriends.map((f) => f._id);
      const listFullNames = selectedFriends.map((f) => f.fullName);

      await addMember(id, listIDs, listFullNames);

      // Nếu thành công thì reset
      setSelectedFriends([]);
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi khi thêm thành viên";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  // Hàm helper để check xem user có đang được chọn không (dùng cho UI)
  const isSelected = (friendID) => {
    return selectedFriends.some((item) => item._id === friendID);
  };

  return (
    <div className="card shadow-sm border-0 mt-3">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-light border-0 rounded-circle"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>
        <h6 className="mb-0 fw-bold flex-grow-1">Thêm thành viên mới</h6>
        <span className="badge bg-light text-dark border">
          Khả dụng: {availableFriends?.length || 0}
        </span>
      </div>

      <div className="card-body p-0">
        <div
          className="list-group list-group-flush"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {!availableFriends || availableFriends.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <small>Không còn bạn bè nào để thêm.</small>
            </div>
          ) : (
            availableFriends.map((friend) => {
              // Check trạng thái checked
              const checked = isSelected(friend._id);

              return (
                <label
                  key={friend._id}
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-3 cursor-pointer ${
                    checked ? "bg-light" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    checked={checked}
                    onChange={() => handleToggleFriend(friend)}
                    style={{ width: "20px", height: "20px" }}
                  />

                  <img
                    src={friend.avatar || "/images/default-avatar.webp"}
                    alt={friend.fullName}
                    className="rounded-circle border"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="flex-grow-1">
                    <div className="fw-medium">{friend.fullName}</div>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {friend.email}
                    </small>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      {availableFriends?.length > 0 && (
        <div className="card-footer bg-white p-3 d-flex gap-2">
          <button
            className="btn btn-primary flex-grow-1"
            onClick={handleAddMembers}
            disabled={selectedFriends.length === 0 || isAdding}
          >
            {isAdding ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <FaUserPlus className="me-2" />
            )}
            {selectedFriends.length > 0
              ? `Thêm (${selectedFriends.length})`
              : "Thêm thành viên"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddMember;
