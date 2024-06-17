import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
    like: Number,
    lyric: String,
    audio: String,
    singer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Singer",
    },
    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: String,
    slug: String,
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

export const Song = mongoose.model("Song", songSchema);
