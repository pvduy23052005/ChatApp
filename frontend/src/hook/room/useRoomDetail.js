import { useState, useEffect } from "react";
import { roomServiceAPI } from "../../services/roomServiceAPI";

export const useRoomDetail = (roomID) => {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomID) return;

      setLoading(true);
      setError(null);

      try {
        const res = await roomServiceAPI.getDetail(roomID);
        if (res.success) {
          setRoom(res.room);
          setFriends(res.friends);
        } else {
          setError("Không tìm thấy dữ liệu phòng");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Lỗi tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomID]);

  return { room, setRoom, setFriends, loading, error, friends };
};
