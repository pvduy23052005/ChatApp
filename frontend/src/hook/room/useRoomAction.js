import { useCallback } from "react";
import { roomServiceAPI } from "../../services/roomServiceAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useRoomAction = () => {
  const navigate = useNavigate();

  const deleteRoom = useCallback(
    async (roomID, roomTitle = "nhóm này") => {
      const isConfirm = window.confirm(
        `Bạn có chắc chắn muốn xóa ${roomTitle}? Hành động này không thể hoàn tác.`,
      );
      if (!isConfirm) return;
      try {
        const res = await roomServiceAPI.delete(roomID);
        if (res.success) {
          toast.success("Xóa nhóm thành công!");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error.response?.data?.message || "Lỗi khi xóa nhóm");
      }
    },
    [navigate],
  );

  const removeMember = useCallback(async (roomID, memberID, fullName) => {
    try {
      const res = await roomServiceAPI.removeMember(roomID, memberID);
      if (res.success) {
        toast.success(`Đã xóa ${fullName} khỏi nhóm`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }, []);

  return {
    deleteRoom,
    removeMember,
  };
};
