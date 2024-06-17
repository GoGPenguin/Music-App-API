import { Request, Response } from "express";
import { Topic } from "../models/topic.model";

export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  });

  console.log(topics);

  res.json({ topics: topics });
};
