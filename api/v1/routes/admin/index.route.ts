import { Express } from "express";
import { uploadRoutes } from "../admin/upload.route";
import { dashboardRoutes } from "../admin/dashboard.route";
import { topicRoutes } from "../admin/topic.route";
import { songsRoutes } from "../admin/song.route";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";

  app.use(`${version}/admin/upload`, uploadRoutes);

  app.use(`${version}/admin/dashboard`, dashboardRoutes)

  app.use(`${version}/admin/topic`, topicRoutes);

  app.use(`${version}/admin/songs`, songsRoutes);

};

export default mainV1Routes;
