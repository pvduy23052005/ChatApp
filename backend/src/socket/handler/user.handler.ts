import { Server, Socket } from "socket.io";
import Room from "../../models/room.model";
import User from "../../models/user.model";

export const userSocket = (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  // chatNotFriend
  socket.on("CLIENT_SEND_CHAT", async (data) => {
    const userID = data.userID;
    const existRoom = await Room.findOne({
      typeRoom: "single",
      "members.user_id": {
        $all: [myID, userID]
      }
    });
    if (existRoom) {
      socket.emit("SERVER_SEND_ROOM_NOT_FRIEND_ID", { roomID: existRoom.id });
    } else {
      const newRoom = new Room(
        {
          typeRoom: "single",
          members: [
            {
              user_id: myID,
              role: "member",
              status: "accepted",
            },
            {
              user_id: userID,
              role: "member",
              status: "waiting",
            }
          ]
        });
      await newRoom.save();
      socket.emit("SERVER_RETURN_ROOM_FRIEND_ID", { roomID: newRoom.id });
    }
  });
  // end chatNotFriend

  // friend request . 
  socket.on("CIENT_FRIEND_REQUEST", async (data) => {
    try {
      await Promise.all([
        // add userB to firnedRequest of userA 
        User.updateOne({ _id: myID }, { $addToSet: { friendRequests: data.userID } }),
        //  add userA to friendAccepts of userB . 
        User.updateOne({ _id: data.userID }, { $addToSet: { friendAccepts: myID } })
      ]);
    } catch (error) {
      console.log(error);
    }
  });
  // end friend request 

  // friend cancel 
  socket.on("CLIENT_FRIEND_CANCEL", async (data) => {
    try {
      await Promise.all([
        // delete userB to firnedRequest of userA 
        User.updateOne({ _id: myID }, { $pull: { friendRequests: data.userID } }),
        //  delete userA to friendAccepts of userB . 
        User.updateOne({ _id: data.userID }, { $pull: { friendAccepts: myID } })
      ]);
    } catch (error) {
      console.log(error);
    }
  });
  // end friend cancel 


  // refuse friend 
  socket.on("CLIENT_REFUSE_FRIEND", async (data) => {
    try {
      await Promise.all([
        User.updateOne({
          _id: myID,
        }, {
          $pull: { friendAccepts: data.userID }
        }),
        User.updateOne({
          _id: data.userID,
        }, {
          $pull: { friendRequests: myID, }
        })
      ])
    } catch (error) {
      console.log(error);
    }
  });
  // end refuse friend 

  // accept friend . 
  socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
    const userID = data.userID;

    try {
      let existRoom = await Room.findOne({
        typeRoom: "single",
        "members.user_id": { $all: [myID, userID] },
      })
        .select("_id")
        .lean();
      let roomChatId;

      if (existRoom) {
        roomChatId = existRoom._id;
        Room.updateOne(
          { _id: roomChatId },
          { $set: { "members.$[].status": "accepted" } }
        ).exec();
      } else {
        const newRoom = await Room.create({
          typeRoom: "single",
          members: [
            { user_id: myID, status: "accepted" },
            { user_id: userID, status: "accepted" },
          ],
        });
        roomChatId = newRoom._id;
      }

      await Promise.all([
        User.updateOne(
          { _id: myID },
          {
            $addToSet: {
              friendList: { user_id: userID, room_chat_id: roomChatId },
            },
            $pull: { friendAccepts: userID },
          }
        ),
        User.updateOne(
          { _id: userID },
          {
            $addToSet: {
              friendList: { user_id: myID, room_chat_id: roomChatId },
            },
            $pull: { friendRequests: myID },
          }
        ),
      ]);

    } catch (error) {
      console.error(error);
    }
  });
  // end accept friend .
}