import mongoose from "mongoose";

const managerSchema = new mongoose.Schema(
  {
    username: String,
    fullName: String,
    password: String,
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dgmzxojxe/image/upload/v1718808546/gszwrscyp1tfry8i5uxf.jpg",
    },
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

export const Manager = mongoose.model("Manager", managerSchema);