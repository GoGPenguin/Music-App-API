import { Router } from "express";
import * as controller from "../../controller/admin/topic.controller";
import multer from "multer";
import { uploadSingle } from "../../middleware/admin/uploadCloud.middleware";
const router: Router = Router();
const upload = multer();

router.get("/", controller.index);

router.get("/detail/:idTopic", controller.detail);

router.post("/create", controller.create);

router.patch(
  "/edit/:idTopic",
  upload.single("avatar"),
  uploadSingle,
  controller.edit
);

router.delete("/delete/:idTopic", controller.deleteTopic);

export const topicRoutes: Router = router;
