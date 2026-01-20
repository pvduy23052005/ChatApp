import { Express } from "express"
import { authRoute } from "./auth.route"
import { chatRoute } from "./chat.route"
import authMiddleware from "../middlewares/auth.middleware"

const allRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/chat", authMiddleware, chatRoute);
}

export default allRoute; 