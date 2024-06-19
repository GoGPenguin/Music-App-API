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
    like: {
      type: Number,
      default: 0,
    },
    playCount: {
      type: Number,
      default: 0,
    },
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
    status: {
      type: String,
      default: "active",
    },
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
