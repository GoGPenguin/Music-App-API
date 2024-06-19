import { Request, Response } from "express";
import { Topic } from "../../models/topic.model";

export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    status: "active",
    deleted: false,
  });

  console.log(topics);

  res.status(200).json({ topics: topics });
};