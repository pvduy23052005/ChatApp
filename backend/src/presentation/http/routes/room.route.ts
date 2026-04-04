import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";
import roomValidate from "../../../infrastructure/validators/room/room.validate";


router.post("/create", controller.createRoomPost);

router.post("/delete/:id",
  roomValidate,
  controller.deleteRoom
)

router.patch("/edit/:id",
  roomValidate,
  controller.editRoom
)

router.get("/detail/:id",
  roomValidate,
  controller.roomDetail
);

router.post("/add-member/:id",
  roomValidate,
  controller.addMember);

router.post("/remove-member/:id",
  roomValidate,
  controller.removeMember);

router.post("/leave/:id",
  roomValidate,
  controller.leaveRoom);

router.post("/assign-admin/:id",
  roomValidate,
  controller.assignAdmin);


export const roomRoute: Router = router;
