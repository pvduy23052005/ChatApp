import { useParams } from "react-router-dom";
import { useAuth } from "../../hook/auth/useAuth";
import { FaDeleteLeft } from "react-icons/fa6";
import { useRoomAction } from "../../hook/room/useRoomAction";
import { useRoomDetail } from "../../hook/room/useRoomDetail";
import RoomHeader from "../../components/room/RoomHeader";

function Detail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { deleteRoom, removeMember } = useRoomAction();
  const { room, setRoom, loading, error } = useRoomDetail(id);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!room) return <div>Không tìm thấy phòng</div>;

  const onRemoveMember = (memberID, fullName) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa ${fullName}? `);
    if (!isConfirm) return;
    setRoom((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.user_id._id !== memberID),
    }));
    removeMember(id, memberID, fullName);
  };

  const myID = user?._id || user?.id;
  const isSuperAdmin = room?.members?.some(
    (m) => m.user_id._id === myID && m.role === "superAdmin",
  );
  const isGroup = room.typeRoom === "group";

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* HEADER */}
          <RoomHeader
            room={room}
            isSuperAdmin={isSuperAdmin}
            deleteRoomFunc={deleteRoom}
          />

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
                        onClick={() => {
                          onRemoveMember(
                            member.user_id._id,
                            member.user_id.fullName,
                          );
                        }}
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
