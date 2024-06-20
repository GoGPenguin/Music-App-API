import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    status: String,
    slug: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  },
  {
    timestamps: true,
  }
);

export const Topic = mongoose.model("Topic", topicSchema);
