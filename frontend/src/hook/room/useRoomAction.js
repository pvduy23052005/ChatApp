import { useCallback } from "react";
import { roomServiceAPI } from "../../services/roomServiceAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { roomServiceSocket } from "../../socket/services/roomServiceSocket";

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
        // emit socket .
        roomServiceSocket.removeMember(roomID, memberID, fullName);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }, []);

  const leaveRoom = useCallback(
    async (roomID, fullName) => {
      const confirm = window.confirm("Bạn có chắc chắn muốn rời nhóm");

      if (!confirm) {
        return;
      }

      try {
        const res = await roomServiceAPI.leaveRoom(roomID);
        if (res.success) {
          toast.success("Bạn đã rời nhóm");
          navigate("/chat");
          // emit socket .
          roomServiceSocket.leaveRoom(roomID, fullName);
        }
      } catch (err) {
        console.log(err.response);
      }
    },
    [navigate],
  );

  const addMember = useCallback(
    async (roomID, memberIDs, listFullNames) => {
      try {
        const res = await roomServiceAPI.addMember(roomID, memberIDs);

        if (res.success) {
          toast.success(res.message);
          // call socket .
          roomServiceSocket.addMembers(roomID, memberIDs, listFullNames);
          navigate(-1);
        }
      } catch (error) {
        console(error.response.data?.message);
      }
    },
    [navigate],
  );

  const assignAdmin = useCallback(async (roomID, memberID, fullName) => {
    try {
      const res = await roomServiceAPI.assignAdmin(roomID, memberID);
      if (res.success) {
        // socket .
        roomServiceSocket.assignAdmin(roomID, fullName);
        toast.success("Phong trưởng nhóm thành công!");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, []);

  return {
    deleteRoom,
    removeMember,
    leaveRoom,
    addMember,
    assignAdmin,
  };
};
