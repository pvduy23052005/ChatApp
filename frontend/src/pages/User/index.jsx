import "../../assets/css/user.css";
import { useUserList } from "../../hook/user/useUserList";
import { useUserAction } from "../../hook/user/useUserAction";

function UserList() {
  const { users } = useUserList();
  const { handleChatNotFriend } = useUserAction();

  return (
    <div className="container py-3">
      <div className="container-user">
        <div className="header">
          <h3>Danh sách người dùng</h3>
        </div>

        <div className="row-users">
          {users.map((user) => (
            <div className="box-user" key={user.id || user._id}>
              {/* Phần Avatar */}
              <div className="inner-avatar">
                <img
                  src={
                    user.avatar ? user.avatar : "/images/default-avatar.webp"
                  }
                  alt={user.fullName}
                />
              </div>

              {/* Phần Info */}
              <div className="inner-info">
                <div className="inner-name">{user.fullName}</div>

                <div className="inner-actions">
                  {/* Nút Kết bạn */}
                  <button className="btn-action btn-add" user-id={user.id}>
                    <i className="fa-solid fa-user-plus"></i> Kết bạn
                  </button>

                  {/* Nút Hủy */}
                  <button className="btn-action btn-cancel" user-id={user.id}>
                    <i className="bx bx-message-circle-x"></i> Hủy
                  </button>

                  {/* Nút Nhắn tin */}
                  <button
                    className="btn-action btn-chat"
                    onClick={() => handleChatNotFriend(user._id)}
                  >
                    <i className="fa-solid fa-comment"></i> Nhắn tin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
