import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";
import roomValidate from "../validate/room/room.validate";

router.post("/create", controller.createRoomPost);

router.post("/delete/:id",
  roomValidate,
  controller.deleteRoomPost
)

router.patch("/edit/:id",
  roomValidate,
  controller.editRoomPost
)

router.get("/detail/:id", controller.roomDetail);

router.post("/add-member/:id",
  roomValidate,
  controller.addMember);

router.post("/remove-member/:id",
  roomValidate,
  controller.removeMember);

router.post("/leave/:id",
  controller.leaveRoom);

export const roomRoute: Router = router;