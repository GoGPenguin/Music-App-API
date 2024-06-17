import { Router } from "express";
import * as controller from "../controller/search.controller"
const router: Router = Router();

router.get("/", controller.searchSongs);

export const searchRoutes: Router = router;