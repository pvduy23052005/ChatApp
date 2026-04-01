import { userServiceSocket } from "../../socket/services/userServiceSocket";

export const useUserAction = () => {
  const handleChatNotFriend = (userID) => {
    userServiceSocket.chatNotFriend(userID);
  };

  const handleFriendRequest = (userID) => {
    userServiceSocket.friendRequest(userID);
  };

  const handleFriendCancel = (userID) => {
    userServiceSocket.cancelRequest(userID);
  };

  const handleFriendRefuse = (userID) => {
    userServiceSocket.refuseFriend(userID);
  };

  const handleFriendAccept = (userID) => {
    userServiceSocket.acceptFriend(userID);
  };

  return {
    handleChatNotFriend,
    handleFriendRequest,
    handleFriendCancel,
    handleFriendRefuse,
    handleFriendAccept,
  };
};
