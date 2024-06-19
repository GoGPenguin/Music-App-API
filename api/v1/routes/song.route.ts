import { Router } from "express";
import * as controller from "../controller/song.controller";
import multer from "multer";
const router: Router = Router();

import * as uploadCloud from "../middleware/uploadCloud.middleware";

const upload = multer();

router.get("/:slugTopic", controller.list);

router.get("/detail/:slugSong", controller.detail);

router.patch("/like/:typeLike/:idSong", controller.like);

router.patch("/favorite/:typeFavorite/:idSong", controller.favorite);

router.patch("/play/:idSong", controller.play);

router.post(
  "/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadMultiple,
  controller.create
);

router.get("/edit/:idSong", controller.edit);

router.patch(
  "/edit/:idSong",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadMultiple,
  controller.editSong
);

export const songRoutes: Router = router;
