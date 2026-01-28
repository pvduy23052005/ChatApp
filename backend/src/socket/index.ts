import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { authSocketMiddleware } from './middleware/auth.middleware';
import { chatSocket } from './handler/chat.handler';
import { userSocket } from './handler/user.handler';
import { roomSocket } from './handler/room.handler';

export const socketInit = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(authSocketMiddleware);

  io.on("connection", async (socket: Socket) => {
    chatSocket(io, socket);
    userSocket(io, socket);
    roomSocket(io, socket);
  })

};