import { Response, Request } from 'express';
import Room from '../models/room.model';
import User from "../models/user.model";

// [post] /room/create.
export const createRoomPost = async (req: Request, res: Response) => {
  try {
    const myID: string = res.locals.user.id.toString() || "";
    const { titleRoom, members } = req.body;

    if (!titleRoom) {
      return res.status(400).json({
        success: false,
        message: "Nhập tên phòng"
      });
    }

    if (!members) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn thành viên"
      });
    }

    // members only a person . =>  conver string -> array . 
    const memberIDs: string[] = Array.isArray(members)
      ? [...members]
      : [members];

    if (memberIDs.length === 1) {
      const userID = memberIDs;
      const existRoom = await Room.findOne({
        typeRoom: "single",
        "members.user_id": {
          $all: [myID, userID]
        }
      });
      if (existRoom) {
        return res.status(400).json({
          success: false,
          message: "Phòng này đã tồn tại"
        });
      }
    }

    const newRoomData = {
      title: titleRoom,
      typeRoom: "group",
      members: [
        {
          user_id: myID,
          role: "superAdmin",
          status: "accepted"
        }
      ]
    }

    memberIDs.forEach((memberID) => {
      newRoomData.members.push({
        user_id: memberID,
        role: "member",
        status: "accepted"
      })
    });

    const newRoom = new Room(newRoomData);
    await newRoom.save();

    res.status(201).json({
      success: true,
      dataRoom: {
        id: newRoom.id,
        title: newRoom.title,
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi đăng xuất"
    });
  }
}

// [post] /room/detail/:id.
export const roomDetail = async (req: Request, res: Response) => {
  try {
    const roomID = req.params.id?.toString();
    const myID: string = res.locals.user.id.toString() || "";
    const user = res.locals.user;

    const detailRoom = await Room.findOne({ _id: roomID }).populate({
      path: "members.user_id",
      select: "fullName avatar"
    }).select("-lastMessageId").lean()


    if (!detailRoom) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập phòng hợp lệ"
      });
    }

    if (detailRoom.deleted === true) {
      return res.status(400).json({
        success: false,
        message: "Phòng đã bị xóa"
      });
    }

    const memberIDs = detailRoom.members.map(
      (member: any) => member.user_id._id.toString());
    const friendIDs = user?.friendList.map(
      (user: any) => user.user_id.toString()
    );

    const friends = await User.find({
      _id: {
        $in: friendIDs,
        $nin: memberIDs
      },
      deleted: false
    }).select("fullName avatar");

    res.status(200).json({
      success: true,
      room: detailRoom,
      friends: friends,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
}

// [patch] /room/edit/:id.
export const editRoomPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Tên phòng không được để trống!",
      });
    }

    await Room.updateOne(
      { _id: id },
      {
        $set: {
          title: title.trim(),
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin phòng thành công!",
      data: {
        _id: id,
        title: title.trim()
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
}

// [post] /room/add-member/:id 
export const addMember = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    let { newMemberIDs } = req.body;
    const room = res.locals.room;

    if (!Array.isArray(newMemberIDs)) {
      newMemberIDs = [newMemberIDs];
    }

    const existMemberIDs = room.members.map(
      (member: any) => member.user_id.toString()
    )

    const filteredMemberIDs = newMemberIDs.filter((userID: string) => {
      const isExistMemberID: boolean = existMemberIDs.includes(userID);
      if (isExistMemberID === false) {
        return true;
      } else {
        return false;
      }
    })

    if (filteredMemberIDs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tất cả người dùng được chọn đã có mặt trong phòng"
      });
    }

    const listNewMembers = filteredMemberIDs.map((userId: string) => {
      return {
        user_id: userId,
        role: "member",
        status: "accepted"
      };
    });

    await Room.updateOne({
      _id: roomID
    }, {
      $push: {
        members: { $each: listNewMembers }
      }
    });

    res.status(200).json({
      success: true,
      message: "Thêm thành công",
      newMemberIDs: newMemberIDs
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
}

// [post] /room/remove-member/:id 
export const removeMember = async (req: Request, res: Response) => {
  try {
    const roomID: string = req.params.id?.toString() || "";
    const { removeMemberID } = req.body;
    const myID: string = res.locals.user.id.toString();

    if (removeMemberID === myID) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa chính mình khỏi nhóm"
      });
    }

    await Room.updateOne({
      _id: roomID
    }, {
      $pull: {
        members: { user_id: removeMemberID }
      }
    });

    res.status(200).json({
      success: true,
      message: "Đã xóa thành viên khỏi nhóm",
      removeMemberID: removeMemberID
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
}

// [post] /room/delete/:id
export const deleteRoomPost = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;

    await Room.updateOne(
      { _id: roomId },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: "Đã xóa phòng chat thành công",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};