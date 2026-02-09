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

// [get] /user/friends
export const getFriends = async (req: Request, res: Response) => {
  try {
    const listFriend = res.locals.user.friendList;
    const friendIDs: string[] = listFriend.map((item: any) => item.user_id);

    const friends = await User.find({
      _id: { $in: friendIDs }
    }).select("fullName avatar");

    res.status(200).json({
      success: true,
      friends: friends
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau"
    });
  }
}

// [post] /user/edit/profile 
export const editProfile = async (req: Request, res: Response) => {
  try {
    const myID = res.locals.user.id;

    const { fullName, avatar } = req.body;

    const updateData: any = {};

    if (fullName) {
      updateData.fullName = fullName.trim();
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    console.log("ok");
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Không có dữ liệu thay đổi!"
      });
    }

    const user = await User.findByIdAndUpdate(
      myID,
      updateData,
      { new: true }
    ).select("-password ");

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng!"
      });
    }

    // 5. Trả về thành công
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Cập nhật thông tin thành công!",
      user: user
    });

  } catch (error) {
    console.error("Error in editProfile:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi Server Internal."
    });
  }
}