import { Express } from "express"
import { authRoute } from "./auth.route"
import { chatRoute } from "./chat.route"
import authMiddleware from "../middlewares/auth.middleware"
import { userRoute } from "./user.route"

const allRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/chat", authMiddleware, chatRoute);

  app.use("/users", authMiddleware, userRoute);
}

export default allRoute; 