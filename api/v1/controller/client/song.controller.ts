import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Topic } from "../../models/topic.model";
import { Singer } from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";
import mongoose from "mongoose";
import { convertToSlug } from "../../../../helper/convertToSlug";

// [GET] /api/v1/songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const { slugTopic } = req.params;
  const topic = await Topic.findOne(
    {
      slug: slugTopic,
      status: "active",
      deleted: false,
    },
    "_id"
  );

  if (!topic) {
    return res.status(404).json({
      message: "Topic not found",
    });
  }

  const songs = await Song.find({
    topic: topic._id,
    status: "active",
    deleted: false,
  }).select("title avatar singer like slug");

  const singerIds = [...new Set(songs.map((song) => song.singer.toString()))];

  const singers = await Singer.find(
    {
      _id: { $in: singerIds },
      status: "active",
      deleted: false,
    },
    "_id fullName avatar slug"
  );

  // Create a map of singerId to singer details
  const singerMap = new Map(
    singers.map((singer) => [singer._id.toString(), singer])
  );

  // Attach singer details to each song
  const songsWithSingerDetails = songs.map((song) => ({
    ...song.toObject(),
    singer: singerMap.get(song.singer.toString()),
  }));

  res.json({ songs: songsWithSingerDetails });
};

// [GET] /api/v1/songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const { slugSong } = req.params;
  // Change to req.cookies.user
  const userId: string = "66701460c80e6ffd071d8431";
  const song = await Song.findOne({
    slug: slugSong,
    status: "active",
    deleted: false,
  });

  const singer = await Singer.findOne({
    _id: song.singer,
    status: "active",
    deleted: false,
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topic,
    status: "active",
    deleted: false,
  }).select("title");

  if (userId) {
    const favorite = await FavoriteSong.findOne({
      user: new mongoose.Types.ObjectId(userId),
      songs: { $in: [song._id] },
    });
    song.set("isFavorite", favorite ? true : false, { strict: false });
  }

  song.set("topic", topic, { strict: false });

  song.set("singer", singer, { strict: false });

  res.json({ song: song });
};

// [PATCH] /api/v1/songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  const { typeLike, idSong } = req.params;

  console.log("Song ID:", idSong);

  if (!mongoose.Types.ObjectId.isValid(idSong)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid song ID format",
    });
  }

  try {
    const song = await Song.findById(idSong);
    console.log("Found song:", song);

    if (!song) {
      return res.status(404).json({
        code: 404,
        message: "Song not found",
      });
    }

    song.like = typeLike === "yes" ? song.like + 1 : song.like - 1;
    await song.save();

    res.json({
      code: 200,
      message: "You liked the song",
    });
  } catch (error) {
    console.error("Error fetching or updating song:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

//[PATCH] /api/v1/songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong = req.params.idSong;
  const typeFavorite = req.params.typeFavorite;
  // Change to req.cookies.user
  const userId: string = "66701460c80e6ffd071d8431";

  if (!mongoose.Types.ObjectId.isValid(idSong)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid song ID format",
    });
  }

  if (userId === "") {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized",
    });
  }

  const song = await Song.findById(idSong);

  if (!song) {
    return res.status(404).json({
      code: 404,
      message: "Song not found",
    });
  }

  const favorite = await FavoriteSong.findOne({
    user: new mongoose.Types.ObjectId(userId),
  });

  try {
    if (typeFavorite === "yes") {
      if (favorite.songs.includes(new mongoose.Types.ObjectId(idSong))) {
        return res.status(400).json({
          code: 400,
          message: "Song already in your favorite list",
        });
      } else {
        favorite.songs.push(new mongoose.Types.ObjectId(idSong));
        await favorite.save();
      }

      res.json({
        code: 200,
        message: "Added to your favorite list",
      });
    } else if (typeFavorite === "no") {
      if (favorite.songs.includes(new mongoose.Types.ObjectId(idSong))) {
        await FavoriteSong.updateOne(
          { user: new mongoose.Types.ObjectId(userId) },
          { $pull: { songs: new mongoose.Types.ObjectId(idSong) } }
        );

        res.json({
          code: 200,
          message: "Removed from your favorite list",
        });
      } else {
        res.status(400).json({
          code: 400,
          message: "Song not in your favorite list",
        });
      }
    } else {
      res.status(400).json({
        code: 400,
        message: "Invalid favorite type",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// [PATCH] /api/v1/songs/play/:idSong
export const play = async (req: Request, res: Response) => {
  const idSong = req.params.idSong;

  if (!mongoose.Types.ObjectId.isValid(idSong)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid song ID format",
    });
  }

  try {
    const song = await Song.findById(idSong);

    if (!song) {
      return res.status(404).json({
        code: 404,
        message: "Song not found",
      });
    }

    song.playCount = song.playCount + 1;
    await song.save();

    res.json({
      code: 200,
      message: "Song played",
      playCount: song.playCount + 1,
    });
  } catch (error) {
    console.error("Error fetching or updating song:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

