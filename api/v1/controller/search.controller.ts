import mongoose from "mongoose";
import { Request, Response } from "express";
import { Song } from "../models/song.model";
import { getInfoSong } from "../../../helper/getInfoSong";
import { convertToSlug } from "../../../helper/convertToSlug";

//[GET] /api/v1/search?keyword=...
export const searchSongs = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  let songs: any;

  if (keyword) {
    const stringSlug = convertToSlug(keyword.toString());
    const slugRegex = new RegExp(stringSlug, "i");
    const keywordRegex = new RegExp(keyword.toString(), "i");
    const newSongs = await Song.find({
      status: "active",
      deleted: false,
      $or: [
        {
          slug: slugRegex,
        },
        {
          title: keywordRegex,
        },
      ],
    }).select("slug title avatar singer topic like");

    songs = await getInfoSong(newSongs);
    console.log(songs);
  }
  res.json(songs);
};
