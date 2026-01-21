import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";

router.post("/create", controller.createRoomPost);

router.get("/detail/:id", controller.roomDetail);

export const roomRoute: Router = router;