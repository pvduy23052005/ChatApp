import { useCallback } from "react";
import { userServiceSocket } from "../../socket/services/userServiceSocket";

export const useUserAction = () => {
  const handleChatNotFriend = useCallback((userID) => {
    userServiceSocket.chatNotFriend({
      userID: userID,
    });
  }, []);

  const handleFriendRequest = useCallback((userID) => {
    userServiceSocket.friendRequest(userID);
  }, []);

  const handleFriendCancel = useCallback((userID) => {
    userServiceSocket.cancelRequest(userID);
  }, []);

  return {
    handleChatNotFriend,
    handleFriendRequest,
    handleFriendCancel,
  };
};
