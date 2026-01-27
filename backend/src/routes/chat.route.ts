import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/chat.controller";
import chatValidate from "../validate/chat/chat.validate";

router.get("/rooms", controller.getListRoom);

router.get("/room/:id", chatValidate, controller.getListChat);

export const chatRoute: Router = router; 