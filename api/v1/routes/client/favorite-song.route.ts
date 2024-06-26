import { Router } from "express";
import * as controller from "../../controller/client/favorite-song.controller";
const router: Router = Router();
const requireAuth = require("../../middleware/client/requireAuth.middleware");

router.get("/", requireAuth, controller.list);

router.patch("/add/:idSong", requireAuth, controller.add);

router.patch("/remove/:idSong", requireAuth, controller.remove);

export const favoriteSongRoutes: Router = router;
