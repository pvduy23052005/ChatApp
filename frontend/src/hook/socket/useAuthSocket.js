import { useEffect } from "react";
import { socket } from "../../socket"; // File chứa instance socket tĩnh

export const useAuthSocket = (isLogin) => {
  useEffect(() => {
    if (isLogin) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      if (socket.connected) {
        console.log("Socket Disconnected");
        socket.disconnect();
      }
    }
  }, [isLogin]);
};
