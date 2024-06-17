import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";

const mainV1Routes = (app: Express): void => {
    const version = "/api/v1";

    app.use(`${version}/topics`, topicRoutes);
    
    app.use(`${version}/songs`, songRoutes);
}

export default mainV1Routes;