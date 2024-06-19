import { Router } from "express";
import * as controller from "../../controller/admin/upload.controller";
import multer from "multer";
import * as uploadCloud from "../../middleware/uploadCloud.middleware";

const router: Router = Router();

const upload = multer();

router.get(
  "/",
  upload.single("file"),
  uploadCloud.uploadSingle,
  controller.index
);

export const uploadRoutes: Router = router;
