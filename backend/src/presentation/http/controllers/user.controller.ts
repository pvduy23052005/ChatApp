import { Response, Request } from 'express';

import { GetUsersUseCase } from "../../../application/use-cases/user/get-users.use-case";
import { GetFriendsUseCase } from "../../../application/use-cases/user/get-friends.use-case";
import { GetFriendAcceptsUseCase } from "../../../application/use-cases/user/get-friend-accepts.use-case";
import { EditProfileUseCase } from "../../../application/use-cases/user/edit-profile.use-case";
import type { IUpdateProfile } from "../../../domain/entities/user/user.type";

import { UserReadRepository, UserWriteRepository } from "../../../infrastructure/database/repositories/user.repository";

const userReadRepo = new UserReadRepository();
const userWriteRepo = new UserWriteRepository();

// [get] /users
export const getUsers = async (req: Request, res: Response) => {
  try {

    const getUsersUseCase = new GetUsersUseCase(userReadRepo);
    const users = await getUsersUseCase.execute(res.locals.user);

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
    const getFriendAcceptsUseCase = new GetFriendAcceptsUseCase(userReadRepo);
    const users = await getFriendAcceptsUseCase.execute(res.locals.user);

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

    const getFriendsUseCase = new GetFriendsUseCase(userReadRepo);
    const friends = await getFriendsUseCase.execute(res.locals.user);

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
    const myID: string = res.locals.user.id.toString();

    const { fullName, avatar } = req.body;

    const updateData: IUpdateProfile = {};

    if (fullName) {
      updateData.fullName = fullName.trim();
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Không có dữ liệu thay đổi!"
      });
    }

    const editProfileUseCase = new EditProfileUseCase(userReadRepo, userWriteRepo);
    const user = await editProfileUseCase.execute(myID, updateData);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng!"
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Cập nhật thông tin thành công!",
      user: {
        id: user.getID(),
        fullName: user.getProfile().fullName,
        email: user.getProfile().email,
        avatar: user.getProfile().avatar
      },
    });

  } catch (error) {
    console.error("Error in editProfile:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi Server Internal."
    });
  }
}
