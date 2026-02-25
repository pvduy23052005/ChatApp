import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";
import roomActionValidate from "../validate/room/roomAction.validate";
import roomValidate from "../validate/room/room.validate";

router.post("/create", controller.createRoomPost);

router.post("/delete/:id",
  roomValidate,
  roomActionValidate,
  controller.deleteRoom
)

router.patch("/edit/:id",
  roomValidate,
  roomActionValidate,
  controller.editRoom
)

router.get("/detail/:id",
  roomValidate,
  controller.roomDetail
);

router.post("/add-member/:id",
  roomValidate,
  roomActionValidate,
  controller.addMember);

router.post("/remove-member/:id",
  roomValidate,
  roomActionValidate,
  controller.removeMember);

router.post("/leave/:id",
  roomValidate,
  controller.leaveRoom);

router.post("/assign-admin/:id",
  roomValidate,
  roomActionValidate,
  controller.assignAdmin);

export const roomRoute: Router = router;