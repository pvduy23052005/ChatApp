import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/user.controller";

router.get("/", controller.getUsers);

router.post("/edit/profile", controller.editProfile);

export const userRoute: Router = router; 
