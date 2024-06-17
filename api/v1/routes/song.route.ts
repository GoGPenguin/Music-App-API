import { Router } from "express";   
import * as controller from "../controller/song.controller"
const router: Router = Router();

router.get("/:slugTopic", controller.list);

router.get("/detail/:slugSong", controller.detail);

router.patch("/like/yes/:idSong", controller.like);

export const songRoutes: Router = router;