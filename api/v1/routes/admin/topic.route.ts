import { Router } from 'express';
import * as controller from '../../controller/admin/topic.controller';
const router: Router = Router();

router.get('/', controller.index);

export const topicRoutes: Router = router;