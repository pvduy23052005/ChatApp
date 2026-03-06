import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/auth.controller";

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.post("/register", controller.register);

export const authRoute: Router = router; 