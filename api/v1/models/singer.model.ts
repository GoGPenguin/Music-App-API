import mongoose from "mongoose";

const singerSchema = new mongoose.Schema(
  {
    fullName: String,
    avatar: String,
    status: String,
    slug: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Singer = mongoose.model("Singer", singerSchema);
