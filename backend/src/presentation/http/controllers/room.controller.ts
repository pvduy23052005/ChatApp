import { Response, Request } from 'express';

import { UserReadRepository } from "../../../infrastructure/database/repositories/user.repository";
import { RoomReadRepository, RoomWriteRepository, RoomMemberRepository } from "../../../infrastructure/database/repositories/room.repository";
import { FriendRepository } from "../../../infrastructure/database/repositories/friend.repository";

import { GetDetailRoomUseCase } from "../../../application/use-cases/room/actions/get-detail-room.use-case";
import { EditRoomUseCase } from "../../../application/use-cases/room/actions/edit-room.use-case";
import { AddMemberUseCase } from "../../../application/use-cases/room/actions/add-member.use-case";
import { RemoveMemberUseCase } from "../../../application/use-cases/room/actions/remove-member.use-case";
import { DeleteRoomUseCase } from "../../../application/use-cases/room/actions/delete-room.use-case";
import { LeaveRoomUseCase } from "../../../application/use-cases/room/actions/leave-room.use-case";
import { AssignAdminUseCase } from "../../../application/use-cases/room/actions/assign-admin.use-case";
import { CreateNewRoomUseCase, CreateRoomOutputDTO } from "../../../application/use-cases/room/actions/create-new-room.use-case";

const roomReadRepo = new RoomReadRepository();
const roomWriteRepo = new RoomWriteRepository();
const roomMemberRepo = new RoomMemberRepository();
const userReadRepo = new UserReadRepository();
const friendRepo = new FriendRepository();

// [post] /room/create.
export const createRoomPost = async (req: Request, res: Response) => {
  try {
    const myID: string = res.locals.user.id.toString() || "";
    const { titleRoom, members } = req.body;

    const createNewRoomUseCase = new CreateNewRoomUseCase(roomWriteRepo);
    const room: CreateRoomOutputDTO = await createNewRoomUseCase.execute(myID, titleRoom, members);

    res.status(201).json({
      success: true,
      room: {
        id: room.id,
        title: room.title,
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

    const getDetailRoomUseCase = new GetDetailRoomUseCase(roomReadRepo, userReadRepo, friendRepo);
    const { detailRoom, friends } = await getDetailRoomUseCase.execute(roomID, user);

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

    const editRoomUseCase = new EditRoomUseCase(roomWriteRepo);
    const updatedRoom = await editRoomUseCase.execute(roomID, title);

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

    const addMemberUseCase = new AddMemberUseCase(roomMemberRepo);
    const addedMemberIDs = await addMemberUseCase.execute(roomID, newMemberIDs, room);

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

    const removeMemberUseCase = new RemoveMemberUseCase(roomMemberRepo);
    const removedID = await removeMemberUseCase.execute(roomID, removeMemberID, myID);

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

    const deleteRoomUseCase = new DeleteRoomUseCase(roomWriteRepo);
    await deleteRoomUseCase.execute(roomID);

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

    const leaveRoomUseCase = new LeaveRoomUseCase(roomMemberRepo);
    await leaveRoomUseCase.execute(roomID, myID, room);

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

    const assignAdminUseCase = new AssignAdminUseCase(roomMemberRepo);
    await assignAdminUseCase.execute(roomID, newAdminID, myID);

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
