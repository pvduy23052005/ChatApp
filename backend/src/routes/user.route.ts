import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/user.controller";

router.get("/", controller.getUsers);

router.get("/friend-accepts", controller.friendAccepts);

router.get("/friends", controller.getFriends);

export const userRoute: Router = router; 