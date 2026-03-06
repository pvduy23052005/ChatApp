import * as roomRepository from "../../../infrastructure/database/repositories/room.repository";
import * as userRepository from "../../../infrastructure/database/repositories/user.repository";

export const getDetailRoom = async (roomID: string, user: any) => {

  if (!roomID || !user) {
    throw new Error("Vui lòng cung cấp ID phòng và ID người dùng");
  }

  const existRoom = await roomRepository.findRoomById(roomID);

  if (!existRoom) {
    throw new Error("Phòng không tồn tại");
  }

  const memberIDs = existRoom.members.map(
    (member: any) => member.user_id._id.toString());
  const friendIDs = user?.friendList?.map(
    (user: any) => user.user_id.toString()
  ) || [];


  const friends = await userRepository.findFriendNotInRoom(friendIDs, memberIDs);

  return {
    detailRoom: existRoom,
    friends: friends
  }
}
