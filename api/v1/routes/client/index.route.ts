import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";
import { userRouters } from "./user.route";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";

  app.use(`${version}/topics`, topicRoutes);

  app.use(`${version}/songs`, songRoutes);

  app.use(`${version}/favorite-songs`, favoriteSongRoutes);

  app.use(`${version}/search`, searchRoutes);

  app.use(`${version}/users`, userRouters);
};

export default mainV1Routes;


