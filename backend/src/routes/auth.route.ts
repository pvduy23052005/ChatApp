import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/auth.controller";

router.post("/login", controller.loginPost);

router.post("/logout", controller.logoutPost);

router.post("/register", controller.register);

export const authRoute: Router = router; 