import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import "../../assets/css/header.css";
import { useAuth } from "../../hook/auth/useAuth";
import { authServiceAPI } from "../../services/authServiceAPI";
import { CiCirclePlus } from "react-icons/ci";
import UserInfo from "./UserInfo";

function Header() {
  const { logout } = useContext(AppContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      await authServiceAPI.logout(user.id);
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <header>
      <div className="container">
        <div className="row align-items-center">
          {/* Menu Navigation */}
          <div className="col-lg-6 col-md-5 col-sm-8 col-6">
            <div className="inner-menu">
              <button onClick={handleLogout} className="btn-menu">
                Đăng xuất
              </button>
              <NavLink to="/user" className="btn-menu" end>
                Người dùng
              </NavLink>
              <NavLink to="/chat" className="btn-menu">
                Tin nhắn
              </NavLink>
              <NavLink to="/user/accept-friends" className="btn-menu">
                Lời mời
              </NavLink>
            </div>
          </div>

          {/* Create Room Button */}
          <div className="col-lg-2 col-md-5 col-sm-2 col-4">
            <div className="inner-new-room">
              {/* Desktop Button */}
              <Link to="/room/create" className="btn-create-room">
                <i className="bx bx-plus"></i>
                Tạo phòng
              </Link>
              {/* Mobile Icon Button */}
              <Link to="/room/create" className="btn-create-room btn-icon">
                <CiCirclePlus />
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="col-lg-4 col-md-2 col-sm-2 col-2">
            <div className="inner-info">
              <img
                src={user?.avatar || "/images/default-avatar.webp"}
                onClick={() => setShowUserInfo(true)}
              />
            </div>
          </div>
          <UserInfo
            user={user}
            isOpen={showUserInfo}
            onClose={() => setShowUserInfo(false)}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
