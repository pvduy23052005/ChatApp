import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/upload.controller";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/files", upload.array("images", 10), controller.uploadFile);

export const uploadRoute: Router = router;