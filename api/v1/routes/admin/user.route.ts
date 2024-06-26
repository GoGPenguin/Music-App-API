import { Router } from "express";
const router = Router();
import * as controller from "../../controller/admin/user.controller";

router.get("/", controller.getAllUsers);

router.post("/create", controller.create);

router.put("/update", controller.update);



export const userRouters = router;