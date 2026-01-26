import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { roomServiceAPI } from "../../services/roomServiceAPI";
import { useAuth } from "../../hook/auth/useAuth";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaDeleteLeft } from "react-icons/fa6";
import { useRoomAction } from "../../hook/room/useRoomAction";

function Detail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { deleteRoom } = useRoomAction();

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomServiceAPI.getDetail(id);
        setRoom(res.room);
        setTitle(res.room.title);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoom();
  }, [id]);

  if (loading) return <div className="text-center mt-4">Đang tải...</div>;

  if (!room)
    return (
      <div className="text-center mt-4 text-danger">Không tìm thấy phòng</div>
    );

  // --- 2. LOGIC QUYỀN HẠN ---
  const myID = user?._id || user?.id;
  const isSuperAdmin = room.members.some(
    (m) => m.user_id._id === myID && m.role === "superAdmin",
  );
  const isGroup = room.typeRoom === "group";

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* HEADER */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                {/* Avatar */}
                <img
                  src={room.avatar || "/images/default-avatar.webp"}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />

                {/* Form sửa tên */}
                <div className="flex-grow-1">
                  <form>
                    <input
                      className="form-control fw-bold"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      readOnly={!isSuperAdmin && !isGroup} // Chỉ cho sửa nếu là Admin hoặc Group
                      placeholder="Tên cuộc trò chuyện"
                    />
                    <small className="text-muted mt-1 d-block">
                      <i className="fas fa-users me-1"></i>{" "}
                      {room.members.length} thành viên
                    </small>
                  </form>
                </div>

                {/* Nút thao tác Admin */}
                {isSuperAdmin && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      title="Lưu tên"
                    >
                      <FaRegSave />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        deleteRoom(id);
                      }}
                    >
                      <RiDeleteBin2Line />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- PHẦN 2: DANH SÁCH THÀNH VIÊN --- */}
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-bold text-primary">
                Danh sách thành viên
              </h6>
              {isGroup && !isSuperAdmin && (
                <button className="btn btn-sm btn-outline-danger">
                  <i className="fa-solid fa-right-from-bracket me-1"></i> Rời
                  nhóm
                </button>
              )}
            </div>

            <div className="list-group list-group-flush">
              {room.members.map((member) => {
                const uInfo = member.user_id;
                const isMe = uInfo._id === myID;

                return (
                  <div
                    className="list-group-item d-flex align-items-center gap-3 py-3"
                    key={uInfo._id}
                  >
                    <img
                      src={uInfo.avatar || "/images/default-avatar.webp"}
                      alt={uInfo.fullName}
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-medium">{uInfo.fullName}</span>
                        {isMe && (
                          <span
                            className="badge bg-secondary"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Bạn
                          </span>
                        )}
                        {member.role === "superAdmin" && (
                          <span
                            className="badge bg-warning text-dark"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Trưởng nhóm
                          </span>
                        )}
                      </div>
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {uInfo.email}
                      </small>
                    </div>

                    {/* Nút xóa thành viên (Chỉ hiện khi mình là SuperAdmin và không xóa chính mình) */}
                    {isSuperAdmin && !isMe && (
                      <button
                        className="btn btn-sm btn-light text-danger"
                        title="Mời ra khỏi nhóm"
                      >
                        <FaDeleteLeft />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
