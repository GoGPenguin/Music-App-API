import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/client/index.route";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./api/v1/typeDefs/index.typeDefs";
import { resolvers } from "./api/v1/resolvers/index.resolvers";
import { requireAuth } from "./api/v1/middleware/client/auth.middleware";
import adminMainV1Routes from "./api/v1/routes/admin/index.route";

const startServer = async () => {
  dotenv.config();

  database.connect();

  const app: Express = express();
  const port: number | string = process.env.PORT || 3000;

  //GraphQL
  app.use("/graphql", requireAuth);

  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => {
      return { ...req }
    }
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cors());

  app.use(cookieParser());

  mainV1Routes(app);
  adminMainV1Routes(app);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
