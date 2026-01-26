import { Response, Request } from 'express';
import User from "../models/user.model";

// [get] /users
export const getUsers = async (req: Request, res: Response) => {
  try {

    const myID = res.locals.user.id.toString();
    const user = res.locals.user;
    const friendIDs: string[] = user.friendList.map((item: any) => item.user_id);
    const acceptIDs: string[] = user.friendAccepts.map((item: any) => item.toString());
    const requestIDs: string[] = user.friendRequests.map((item: any) => item.toString());

    const listId = [
      myID,
      ...friendIDs,
      ...acceptIDs,
      ...requestIDs,
    ];

    const users = await User.find({
      _id: { $nin: listId },
      deleted: false
    }).select("fullName avatar");

    res.status(200).json({
      success: true,
      users: users
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}


// [get] /user/friend-accepts . 
export const friendAccepts = async (req: Request, res: Response) => {
  try {
    const myID: string = res.locals.user.id.toString();
    const listIdFriendAccepts: string[] = res.locals.user.friendAccepts;

    const users: any = await User.find({
      $and: [
        { _id: { $ne: myID } },
        { _id: { $in: listIdFriendAccepts } }],
      deleted: false
    }).select("fullName avatar");

    res.status(200).json({
      success: true,
      friendAccepts: users
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }

}