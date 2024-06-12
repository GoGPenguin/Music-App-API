import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import * as database from "./config/database";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

app.get("/topics", (req: Request, res: Response, next: NextFunction) => {
  res.json({ topics: ["Music", "Movies", "Sports"] });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
