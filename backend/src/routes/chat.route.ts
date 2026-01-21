import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/chat.controller";

router.get("/rooms", controller.getListRoom);

router.get("/room/:id" , controller.getListChat);

export const chatRoute: Router = router; 