import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { authSocketMiddleware } from './middleware/auth.middleware';
import { chatSocket } from './handler/chat.handler';
import { userSocket } from './handler/user.handler';
import { roomSocket } from './handler/room.handler';
import Room from "../models/room.model";

export const socketInit = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  (global as any)._io = io;

  io.use(authSocketMiddleware);

  io.on("connection", async (socket: Socket) => {
    const myID = socket.data.user.userId;
    if (myID) {
      const rooms = await Room.find({
        "members.user_id": myID,
        deleted: false
      }).select("_id").lean();

      if (rooms.length > 0) {
        rooms.forEach((room: any) => {
          const roomId = room._id.toString();
          socket.join(roomId); 
        });
      }
    }

    chatSocket(io, socket);
    userSocket(io, socket);
    roomSocket(io, socket);
  })

};