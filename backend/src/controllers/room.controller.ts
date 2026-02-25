import { Response, Request } from 'express';

import * as roomService from "../services/room.service";
import Room from "../models/room.model";
import User from "../models/user.model";

// [post] /room/create.
export const createRoomPost = async (req: Request, res: Response) => {
  try {
    const myID: string = res.locals.user.id.toString() || "";
    const { titleRoom, members } = req.body;

    const newRoom = await roomService.createNewRoom(myID, titleRoom, members);

    res.status(201).json({
      success: true,
      dataRoom: {
        id: newRoom.id,
        title: newRoom.title,
      }
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống "
    });
  }
}

// [post] /room/detail/:id.
export const roomDetail = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const user: any = res.locals.user;

    const { detailRoom, friends } = await roomService.getDetailRoom(roomID, user);

    res.status(200).json({
      success: true,
      room: detailRoom,
      friends: friends,
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
}

// [patch] /room/edit/:id.
export const editRoom = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const { title } = req.body;

    const updatedRoom = await roomService.editRoom(roomID, title);

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin phòng thành công!",
      data: updatedRoom
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
}

// [post] /room/add-member/:id 
export const addMember = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const { newMemberIDs } = req.body;
    const room = res.locals.room;

    const addedMemberIDs = await roomService.addMember(roomID, newMemberIDs, room);

    res.status(200).json({
      success: true,
      message: "Thêm thành công",
      newMemberIDs: addedMemberIDs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
}

// [post] /room/remove-member/:id 
export const removeMember = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const { removeMemberID } = req.body;
    const myID: string = res.locals.user.id.toString();

    const removedID = await roomService.removeMember(roomID, removeMemberID, myID);

    res.status(200).json({
      success: true,
      message: "Đã xóa thành viên khỏi nhóm",
      removeMemberID: removedID
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
}

// [post] /room/delete/:id
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";

    await roomService.deleteRoom(roomID);

    res.status(200).json({
      success: true,
      message: "Đã xóa phòng chat thành công",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
};

// [post] /room/leave/:id
export const leaveRoom = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const myID: string = res.locals.user.id.toString();
    const room = res.locals.room;

    await roomService.leaveRoom(roomID, myID, room);

    res.status(200).json({
      success: true,
      message: "Bạn đã rời nhóm",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
}

// [post] /room/assign-admin/:id
export const assignAdmin = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const { newAdminID } = req.body;
    const myID: string = res.locals.user.id.toString();

    await roomService.assignAdmin(roomID, newAdminID, myID);

    res.status(200).json({
      success: true,
      message: "Thay dổi quyền thành công"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
}
