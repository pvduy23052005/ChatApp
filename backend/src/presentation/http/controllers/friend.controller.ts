import { Request, Response } from "express";
import { FriendRequestRepository } from "../../../infrastructure/database/repositories/friendRequest.repository";
import { FriendRepository } from "../../../infrastructure/database/repositories/friend.repository";
import { UserReadRepository } from "../../../infrastructure/database/repositories/user.repository";
import { RoomReadRepository, RoomWriteRepository } from "../../../infrastructure/database/repositories/room.repository";

import { FriendRequestUseCase } from "../../../application/use-cases/friend/friend-request.use-case";
import { GetFriendRequestsUseCase } from "../../../application/use-cases/friend/get-friend-requests.use-case";
import { AcceptFriendUseCase } from "../../../application/use-cases/friend/accept-friend.use-case";
import { RefuseFriendUseCase } from "../../../application/use-cases/friend/refuse-friend.use-case";
import { FriendCancelUseCase } from "../../../application/use-cases/friend/friend-cancel.use-case";
import { GetFriendsUseCase } from "../../../application/use-cases/friend/get-friends.use-case";

const friendRequestRepo = new FriendRequestRepository();
const friendRepo = new FriendRepository();
const userReadRepo = new UserReadRepository();
const roomReadRepo = new RoomReadRepository();
const roomWriteRepo = new RoomWriteRepository();

// [POST] /friends/requests
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = res.locals.user.id.toString();
    const receiverId = req.body.userId?.toString() || "";

    const useCase = new FriendRequestUseCase(friendRequestRepo);
    await useCase.execute(senderId, receiverId);

    res.status(201).json({
      success: true,
      message: "Gửi lời mời kết bạn thành công"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi gửi lời mời kết bạn"
    });
  }
};

// [GET] /friends/requests
export const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const myId = res.locals.user.id.toString();

    const useCase = new GetFriendRequestsUseCase(friendRequestRepo);
    const result = await useCase.execute(myId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};

// [PUT] /friends/requests/:id/accept
export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const myId = res.locals.user.id.toString();
    const requestId: string = req.params.id?.toString() || "";

    const useCase = new AcceptFriendUseCase(
      roomReadRepo,
      roomWriteRepo,
      friendRepo,
      friendRequestRepo
    );
    await useCase.execute(requestId, myId);

    res.status(200).json({
      success: true,
      message: "Chấp nhận lời mời kết bạn thành công"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi chấp nhận lời mời kết bạn"
    });
  }
};

// [PUT] /friends/requests/:id/refuse
export const refuseFriendRequest = async (req: Request, res: Response) => {
  try {
    const myId = res.locals.user.id.toString();
    const requestId: string = req.params.id?.toString() || "";

    const useCase = new RefuseFriendUseCase(friendRequestRepo);
    await useCase.execute(requestId, myId);

    res.status(200).json({
      success: true,
      message: "Từ chối lời mời kết bạn thành công"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi từ chối lời mời kết bạn"
    });
  }
};

// [DELETE] /friends/cancel/:id
export const cancelFriendRequest = async (req: Request, res: Response) => {
  try {
    const myId = res.locals.user.id.toString();
    const requestId: string = req.params.id?.toString() || "";

    const useCase = new FriendCancelUseCase(friendRequestRepo);
    await useCase.execute(requestId, myId);

    res.status(200).json({
      success: true,
      message: "Hủy lời mời kết bạn thành công"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi hủy lời mời kết bạn"
    });
  }
};

// [GET] /friends
export const getFriends = async (req: Request, res: Response) => {
  try {
    const myId = res.locals.user.id.toString();

    const useCase = new GetFriendsUseCase(friendRepo, userReadRepo);
    const result = await useCase.execute(myId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};
