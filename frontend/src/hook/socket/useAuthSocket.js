import { useEffect } from "react";
import { socket } from "../../socket";

export const useAuthSocket = (isLogin) => {
  useEffect(() => {
    if (isLogin) {
      if (!socket.connected) {
        socket.connect();
        console.log("connected" , socket.id);
      }
    } else {
      if (!socket.connect) {
        console.log("disconnetd");
        socket.disconnect();
      }
    }
  }, [isLogin]);
};
