import mongoose from "mongoose";

const favoriteSongSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const FavoriteSong = mongoose.model(
  "FavoriteSong",
  favoriteSongSchema,
  "favorite-songs"
);
export default FavoriteSong;
