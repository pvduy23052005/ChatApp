import { Express } from "express"
import { authRoute } from "./auth.route"

const allRoute = (app: Express) => {

  app.use("/auth", authRoute);
}

export default allRoute; 