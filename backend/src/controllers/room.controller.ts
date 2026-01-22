import { Response, Request } from 'express';
import Room from '../models/room.model';
import User from "../models/user.model";
import { RiReservedFill } from 'react-icons/ri';

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

    const [user, detailRoom] = await Promise.all([
      User.findOne({ _id: myID, deleted: false }).select("friendList"),
      Room.findOne({ _id: roomID, deleted: false }).populate({
        path: "members.user_id",
        select: "fullName avatar"
      })
    ]);

    if (!detailRoom) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập phòng hợp lệ"
      });
    }

    const memberIDs = detailRoom.members.map(
      (member: any) => member.user_id._id.toString());
    const friendIDs = user?.friendList.map(
      (id: any) => id.toString()
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

// [post] /room/add-member/:id 
export const addMember = async (req: Request, res: Response) => {
  const roomID: string = req.params.id?.toString() || "";
  let { newMemberIDs } = req.body.memberIDs;
  const myID: string = res.locals.user.id.toString();

  const room = await Room.findOne({
    _id: roomID,
    deleted: false
  })

  if (!room) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập phòng hợp lệ"
    });
  }

  const currentMember = room.members.find(
    (member: any) => member.user_id._id.toString() === myID
  )

  if (currentMember?.role !== "superAdmin") {
    return res.status(400).json({
      success: false,
      message: "Bạn không có quyền xóa thành viên"
    });
  }

  if (newMemberIDs === myID) {
    return res.status(400).json({
      success: false,
      message: "Không thể xóa chính mình khỏi nhóm"
    });
  }

  if (!Array.isArray(newMemberIDs)) {
    newMemberIDs = [newMemberIDs];
  }

  const listNewMembers = newMemberIDs.map((userId: string) => {
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
  })
}