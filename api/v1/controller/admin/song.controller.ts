import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Topic } from "../../models/topic.model";
import { Singer } from "../../models/singer.model";
import mongoose from "mongoose";
import { convertToSlug } from "../../../../helper/convertToSlug";


export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    status: "active",
    deleted: false,
  });

  console.log(songs);

  res.status(200).json({ songs: songs });
};

//[GET] /api/v1/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    status: "active",
    deleted: false,
  });

  const singers = await Singer.find({
    status: "active",
    deleted: false,
  });

  res.status(200).json({
    topics,
    singers,
  });
};

// [POST] /api/v1/songs/create
export const createSong = async (req: Request, res: Response) => {
  const { title, description, singer, topic } = req.body;
  const avatar = req.body.avatar ? req.body.avatar[0] : null;
  const audio = req.body.audio ? req.body.audio[0] : null;

  try {
    if (!title || !avatar || !description || !singer || !topic || !audio) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const singerExist = await Singer.findById(
      new mongoose.Types.ObjectId(singer)
    );
    if (!singerExist) {
      return res.status(404).json({
        message: "Singer not found",
      });
    }

    const topicExist = await Topic.findById(new mongoose.Types.ObjectId(topic));
    if (!topicExist) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    const newSong = new Song({
      title,
      avatar,
      audio,
      description,
      singer: new mongoose.Types.ObjectId(singer),
      topic: new mongoose.Types.ObjectId(topic),
      slug: convertToSlug(title),
    });

    await newSong.save();

    singerExist.songs.push(newSong._id);
    topicExist.songs.push(newSong._id);

    await singerExist.save();
    await topicExist.save();
    res.status(200).json({
      message: "Song created successfully",
      newSong,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// [GET] /api/v1/songs/edit/:idSong
export const edit = async (req: Request, res: Response) => {
  const { idSong } = req.params;

  try {
    const song = await Song.findById(new mongoose.Types.ObjectId(idSong));

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    const topics = await Topic.find({
      status: "active",
      deleted: false,
    });

    const singers = await Singer.find({
      status: "active",
      deleted: false,
    });

    res.status(200).json({
      song,
      topics,
      singers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// [PATCH] /api/v1/songs/edit/:idSong
export const editSong = async (req: Request, res: Response) => {
  const { idSong } = req.params;
  const { title, description, singer, topic } = req.body;
  const avatar = req.body.avatar ? req.body.avatar[0] : null;
  const audio = req.body.audio ? req.body.audio[0] : null;

  try {
    if (!title || !description || !singer || !topic) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const singerExist = await Singer.findById(
      new mongoose.Types.ObjectId(singer)
    );
    if (!singerExist) {
      return res.status(404).json({
        message: "Singer not found",
      });
    }

    const topicExist = await Topic.findById(new mongoose.Types.ObjectId(topic));
    if (!topicExist) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    const song = await Song.findById(new mongoose.Types.ObjectId(idSong));

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    if (
      song.title === title &&
      (song.avatar === avatar || !avatar) &&
      (song.audio === audio || !audio) &&
      song.description === description &&
      song.singer.toString() === singer &&
      song.topic.toString() === topic
    ) {
      return res.status(400).json({
        message: "No changes detected",
      });
    }

    song.title = title;
    if (avatar) song.avatar = avatar;
    if (audio) song.audio = audio;
    song.description = description;
    song.singer = new mongoose.Types.ObjectId(singer);
    song.topic = new mongoose.Types.ObjectId(topic);
    song.slug = convertToSlug(title);

    await song.save();

    if (song.singer.toString() !== singer) {
      const oldSinger = await Singer.findById(song.singer);
      oldSinger.songs.splice(oldSinger.songs.indexOf(song._id), 1);
      singerExist.songs.push(song._id);
      await oldSinger.save();
      await singerExist.save();
    }
    if (song.topic.toString() !== topic) {
      const oldTopic = await Topic.findById(song.topic);
      oldTopic.songs.splice(oldTopic.songs.indexOf(song._id), 1);
      topicExist.songs.push(song._id);
      await oldTopic.save();
      await topicExist.save();
    }

    res.status(200).json({
      message: "Song updated successfully",
      song,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
