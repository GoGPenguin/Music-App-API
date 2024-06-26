import { Router } from "express";
import * as controller from "../../controller/admin/singer.controller";
import { uploadSingle } from "../../middleware/admin/uploadCloud.middleware";
import multer from "multer";

const upload = multer();
const router: Router = Router();

router.get("/", controller.index);

router.get("/detail/:idSinger", controller.detail);

router.post(
  "/create",
  upload.single("avatar"),
  uploadSingle,
  controller.create
);

router.patch(
  "/edit/:idSinger",
  upload.single("avatar"),
  uploadSingle,
  controller.edit
);

router.delete("/delete/:idSinger", controller.deleteSinger);

export const singerRoutes: Router = Router();
