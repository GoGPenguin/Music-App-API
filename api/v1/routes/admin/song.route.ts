import { Router } from "express";
import * as controller from "../../controller/admin/song.controller";
import multer from "multer";

import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.get("/:slugTopic", controller.songsByTopic)

router.get("/singer/:slugSinger", controller.songsBySinger);

router.get('/detail/:slug', controller.detail);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadMultiple,
  controller.createSong
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

router.delete("/delete/:idSong", controller.deleteSong);

export const songsRoutes: Router = router;
