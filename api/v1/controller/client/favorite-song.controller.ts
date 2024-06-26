import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import mongoose from "mongoose";
import { Song } from "../../models/song.model";
import { getInfoSong } from "../../../../helper/getInfoSong";

// [GET] /api/v1/favorite-songs
export const list = async (req: Request, res: Response) => {
  // Change to req.cookies.user
  const userId = req.cookies.user;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const favoriteSongsIds = await FavoriteSong.findOne(
      {
        user: new mongoose.Types.ObjectId(userId),
      },
      "-_id songs"
    );

    const favoriteSongs = await Promise.all(
      favoriteSongsIds?.songs.map(async (songId) => {
        return await Song.findById(songId).select(
          "slug title avatar singer topic like"
        );
      })
    );

    // Attach topic and singer details to each song
    const favoriteSongsWithInfos = await getInfoSong(favoriteSongs);

    const response = {
      length: favoriteSongs.length,
      favoriteSongsWithInfos,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching favorite songs:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// [PATCH] /api/v1/favorite-songs/add/:idSong
export const add = async (req: Request, res: Response) => {
  const { idSong } = req.params;
  const userId = req.cookies.user;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const favoriteSong = await FavoriteSong.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!favoriteSong) {
      const newFavoriteSong = new FavoriteSong({
        user: new mongoose.Types.ObjectId(userId),
        songs: [new mongoose.Types.ObjectId(idSong)],
      });

      await newFavoriteSong.save();
    } else {
      favoriteSong.songs.push(new mongoose.Types.ObjectId(idSong));
      await favoriteSong.save();
    }

    res.json({
      message: "Song added to favorite list",
    });
  } catch (error) {
    console.error("Error adding song to favorite list:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// [PATCH] /api/v1/favorite-songs/remove/:idSong
export const remove = async (req: Request, res: Response) => {
  const { idSong } = req.params;
  const userId = req.cookies.user;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const favoriteSong = await FavoriteSong.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!favoriteSong) {
      res.status(404).json({
        message: "Favorite song not found",
      });
    }

    favoriteSong.songs = favoriteSong.songs.filter(
      (songId) => songId.toString() !== idSong
    );

    await favoriteSong.save();

    res.json({
      message: "Song removed from favorite list",
    });
  } catch (error) {
    console.error("Error removing song from favorite list:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
