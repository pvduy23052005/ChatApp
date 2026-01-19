import { Express } from "express"
import { authRoute } from "./auth.route"
import {chatRoute} from "./chat.route"

const allRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/chat" , chatRoute);
}

export default allRoute; 