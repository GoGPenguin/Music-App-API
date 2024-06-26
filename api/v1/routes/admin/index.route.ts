import { Express } from "express";
import { uploadRoutes } from "../admin/upload.route";
import { dashboardRoutes } from "../admin/dashboard.route";
import { topicRoutes } from "../admin/topic.route";
import { songsRoutes } from "../admin/song.route";
import { userRouters } from "./user.route";
import { loginRoutes } from "./login.route";
import { singerRoutes } from "./singer.route";

import { requireAuth } from "../../middleware/admin/auth.middleware";

const  adminMainV1Routes = (app: Express): void => {
  const version = "/api/v1";

  app.use(`${version}/admin/upload`, requireAuth, uploadRoutes);

  app.use(`${version}/admin/dashboard`, requireAuth, dashboardRoutes)

  app.use(`${version}/admin/topics`, requireAuth, topicRoutes);

  app.use(`${version}/admin/songs`, requireAuth, songsRoutes);

  app.use(`${version}/admin/users`, requireAuth, userRouters);

  app.use(`${version}/admin/singers`, requireAuth, singerRoutes);

  app.use('/admin', loginRoutes)

};

export default adminMainV1Routes;
