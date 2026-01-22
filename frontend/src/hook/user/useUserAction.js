import { useCallback } from "react";
import { userServiceSocket } from "../../socket/services/userServiceSocket";

export const useUserAction = () => {
  const handleChatNotFriend = useCallback((userID) => {
    userServiceSocket.chatNotFriend({
      userID: userID,
    });
  }, []);

  return {
    handleChatNotFriend,
  };
};
