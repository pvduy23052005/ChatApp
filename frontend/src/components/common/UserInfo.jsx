import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaSave } from "react-icons/fa";
import "../../assets/css/user/style.css";

const UserInfo = ({ user, isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user?.fullName, isOpen]);

  if (!isOpen) return null;

  const handleSaveClick = async () => {
    if (!fullName.trim()) {
      alert("Tên không được để trống!");
      return;
    }

    setIsSaving(true);

    setIsSaving(false);
    onClose();
  };

  return (
    <div className="user-info-overlay" onClick={onClose}>
      <div className="user-info-card" onClick={(e) => e.stopPropagation()}>
        {/* Nút đóng */}
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h3 className="form-title">Cập nhật hồ sơ</h3>

        {/* Avatar Area */}
        <div className="user-info-avatar-wrapper">
          <div className="user-info-avatar">
            <img
              src={user?.avatar || "/images/default-avatar.webp"}
              alt="Avatar"
            />
          </div>
          {/* icon updalod */}
          <div className="camera-icon">
            <FaCamera />
          </div>
        </div>

        <div className="form-body">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên..."
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email..."
            />
          </div>

          {/* Nút Save */}
          <button
            className="btn-save"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? (
              "Đang lưu..."
            ) : (
              <>
                <FaSave className="me-2" /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
