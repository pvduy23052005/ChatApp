import { Response, Request } from 'express';
import Room from '../models/room.model';

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

    let memberIDs: string[] = [];

    // members only a person . =>  conver string -> array . 
    if (!Array.isArray(members)) {
      memberIDs = [members];
    }

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

