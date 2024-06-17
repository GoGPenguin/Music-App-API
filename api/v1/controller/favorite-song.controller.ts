import { Request, Response } from "express";
import FavoriteSong from "../models/favorite-song.model";
import mongoose from "mongoose";
import { Song } from "../models/song.model";
import { getInfoSong } from "../../../helper/getInfoSong";

// [GET] /api/v1/favorite-songs
export const list = async (req: Request, res: Response) => {
    // Change to req.cookies.user
    const userId: string = "66701460c80e6ffd071d8431";

    if (!userId) {
        res.status(401).json({
            message:  "Unauthorized",
        });
    } 
    
    try {
        const favoriteSongsIds = await FavoriteSong.findOne({
            user: new mongoose.Types.ObjectId(userId),
        }, "-_id songs");

        const favoriteSongs = await Promise.all(
            favoriteSongsIds?.songs.map(async (songId) => {
                return await Song.findById(songId).select("slug title avatar singer topic like");
            })
        );

        // Attach topic and singer details to each song
        const favoriteSongsWithInfos = await getInfoSong(favoriteSongs)

        const response = {
            length: favoriteSongs.length,
            favoriteSongsWithInfos
        }

        res.json(response);
    } catch (error) {
        console.error("Error fetching favorite songs:", error);
        res.status(500).json({
            code: 500,
            message: "Internal server error",
        });
    }
}