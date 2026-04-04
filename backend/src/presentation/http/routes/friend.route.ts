import { Router } from "express";
import * as controller from "../controllers/friend.controller";

const router: Router = Router();

// /friends/requests
router.post("/requests", controller.sendFriendRequest);
router.get("/requests", controller.getFriendRequests);
router.put("/requests/:id/accept", controller.acceptFriendRequest);
router.put("/requests/:id/refuse", controller.refuseFriendRequest);
router.delete("/requests/:id", controller.cancelFriendRequest);

// /friends
router.get("/", controller.getFriends);

export const friendRoute: Router = router;
