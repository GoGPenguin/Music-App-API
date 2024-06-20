import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/client/index.route";
import { ApolloServer, gql } from "apollo-server-express";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

const startServer = async () => {
  dotenv.config();

  database.connect();

  const app: Express = express();
  const port: number | string = process.env.PORT || 3000;

  //GraphQL
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cors());

  mainV1Routes(app);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
