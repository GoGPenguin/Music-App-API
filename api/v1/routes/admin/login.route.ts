import { Router } from "express";
const router = Router();
import * as controller from "../../controller/admin/login.controller";

router.post("/login", controller.login);

router.get("/logout", controller.logout);

export const loginRoutes: Router = router;