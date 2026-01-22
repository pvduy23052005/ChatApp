import { Server, Socket } from "socket.io";
import Room from "../../models/room.model";

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
      socket.emit("SERVER_SEND_ROOM_ID", { roomID: existRoom.id });
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
      socket.emit("SERVER_SEND_ROOM_ID", { roomID: newRoom.id });
    }
  });
  // end chatNotFriend

}