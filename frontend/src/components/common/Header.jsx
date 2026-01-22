import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext"; // Nhớ sửa đường dẫn đúng với folder của bạn
import "../../assets/css/header.css"; // Import file CSS vào
import { useAuth } from "../../hook/auth/useAuth";
import { authServiceAPI } from "../../services/authServiceAPI";

function Header() {
  const { logout } = useContext(AppContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      const res = await authServiceAPI.logout();
      console.log(res);
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="row">
            {/* --- Cột 1: Menu --- */}
            <div className="col-6 col-md-5 col-sm-5">
              <div className="inner-menu">
                {/* Logout xử lý bằng onClick thay vì href */}
                <button
                  onClick={handleLogout}
                  className="btn btn-menu"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Đăng xuất
                </button>
                <NavLink to="/user" className="btn btn-menu">
                  Người dùng
                </NavLink>
                <NavLink to="/chat" className="btn btn-menu">
                  Tin nhắn
                </NavLink>
                <NavLink to="/user/friend-accepts" className="btn btn-menu">
                  Lời mời
                </NavLink>
              </div>
            </div>

            {/* --- Cột 2: Search --- */}
            <div className="col-3 col-md-4 col-sm-5">
              <div className="inner-search">
                <form id="form-search">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm"
                  />
                </form>
              </div>
            </div>

            {/* --- Cột 3: Nút tạo phòng --- */}
            <div className="col-1 col-md-2 col-sm-1">
              <div className="inner-new-room">
                {/* Nút hiện chữ (Màn hình lớn) */}
                <Link to="/room/create" className="btn btn-create-room">
                  Tạo phòng
                </Link>

                {/* Nút hiện Icon (Màn hình nhỏ - Responsive) */}
                <Link
                  to="/room/create"
                  className="btn btn-create-room btn-icon"
                >
                  <i className="bx bx-plus"></i>
                </Link>
              </div>
            </div>

            {/* --- Cột 4: Info User --- */}
            <div className="col-2 col-md-1 col-sm-1">
              <div className="inner-info">
                {/* Kiểm tra user có tồn tại không để tránh lỗi null */}
                <span className="name">{user?.fullName}</span>

                <img
                  src={user?.avatar || "/images/default-avatar.webp"}
                  alt="Avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
