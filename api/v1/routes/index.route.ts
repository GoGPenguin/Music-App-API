import { Express } from "express";
import { topicRoutes } from "./topic.route";

const mainV1Routes = (app: Express): void => {
    const version = "/api/v1";

    app.use(`${version}/topics`, topicRoutes);
}

export default mainV1Routes;