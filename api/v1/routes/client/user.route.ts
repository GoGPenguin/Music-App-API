import { Router } from "express";
import * as controller from "../../controller/client/user.controller";
const router: Router = Router();
import { requireAuth } from "../../middleware/client/auth.middleware";
import * as uploadCloud from "../../middleware/client/uploadCloud.middleware";
import multer from "multer";

const upload = multer();

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", requireAuth, controller.detail);

router.get("/logout", requireAuth, controller.logout);

router.put(
  "/update",
  requireAuth,
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.update
);

export const userRouters: Router = router;
