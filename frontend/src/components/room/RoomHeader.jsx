import { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { roomServiceAPI } from "../../services/roomServiceAPI"; // Import API trực tiếp vào đây

function RoomHeader({ room, isSuperAdmin, deleteRoomFunc }) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleSet = () => {
      if (room?.title) {
        setTitle(room.title);
      }
    };
    handleSet();
  }, [room]);

  if (!room) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Tên phòng không được để trống!");
      return;
    }

    try {
      setIsSaving(true);
      const res = await roomServiceAPI.edit(room._id, title);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Lỗi khi cập nhật tên";
      toast.error(msg);
      setTitle(room.title);
      setTitle(room.title);
    }
    setIsSaving(false);
  };

  const isChanged = title !== room.title;

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3">
          {/* Avatar */}
          <div className="position-relative">
            <img
              src={room.avatar || "/images/default-avatar.webp"}
              alt="Avatar"
              className="rounded-circle border"
              style={{ width: "65px", height: "65px", objectFit: "cover" }}
            />
          </div>

          {/* Form Input */}
          <div className="flex-grow-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                className="form-control fw-bold border-0 px-0 fs-5 "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isSuperAdmin}
                placeholder="Tên cuộc trò chuyện"
                style={{ backgroundColor: "transparent" }}
              />
              <small className="text-muted d-flex align-items-center">
                <i className="fa-solid fa-users me-2"></i>
                {room.members?.length || 0} thành viên
              </small>
            </form>
          </div>

          {/* Các nút thao tác (Chỉ Admin) */}
          {isSuperAdmin && (
            <div className="d-flex gap-2">
              {isChanged && (
                <button
                  className="btn btn-outline-primary"
                  title="Lưu thay đổi"
                  onClick={handleSubmit}
                >
                  {isSaving ? (
                    <span> Dang luu ... </span>
                  ) : (
                    <>
                      <FaRegSave /> Lưu
                    </>
                  )}
                </button>
              )}

              <button
                className="btn btn-outline-danger "
                onClick={() => deleteRoomFunc(room._id, room.title)}
                title="Giải tán nhóm"
              >
                <RiDeleteBin2Line /> Xóa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomHeader;
