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

  const handleFriendRefuse = useCallback((userID) => {
    userServiceSocket.refuseFriend(userID);
  }, []);

  const handleFriendAccept = useCallback((userID) => {
    userServiceSocket.acceptFriend(userID);
  }, []);

  return {
    handleChatNotFriend,
    handleFriendRequest,
    handleFriendCancel,
    handleFriendRefuse,
    handleFriendAccept,
  };
};
