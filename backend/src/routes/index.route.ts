import { Express } from "express"
import { authRoute } from "./auth.route"
import { chatRoute } from "./chat.route"
import authMiddleware from "../middlewares/auth.middleware"
import { userRoute } from "./user.route"
import { roomRoute } from "./room.route"
import { uploadRoute } from "./upload.route"

const allRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/chat", authMiddleware, chatRoute);

  app.use("/users", authMiddleware, userRoute);

  app.use("/room", authMiddleware, roomRoute);

  app.use("/upload", authMiddleware, uploadRoute);
}

export default allRoute; 