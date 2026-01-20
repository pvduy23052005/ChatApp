import { useEffect } from "react";
import { socket } from "../../socket";

export const useAuthSocket = (isLogin) => {
  useEffect(() => {
    if (isLogin) {
      if (!socket.connected) {
        socket.connect();
        console.log("connected");
      }
    } else {
      if (!socket.connect) {
        socket.disconnect();
      }
    }
  }, [isLogin]);
};
