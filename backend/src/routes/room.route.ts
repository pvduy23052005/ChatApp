import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";
import roomValidate from "../validate/room/room.validate";

router.post("/create", controller.createRoomPost);

router.get("/detail/:id", controller.roomDetail);

router.post("/add-member/:id",
  roomValidate,
  controller.addMember);

router.post("/remove-member/:id",
  roomValidate,
  controller.removeMember);

export const roomRoute: Router = router;