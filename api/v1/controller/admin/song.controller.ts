import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Topic } from "../../models/topic.model";
import { Singer } from "../../models/singer.model";
import mongoose from "mongoose";
import { convertToSlug } from "../../../../helper/convertToSlug";

// [GET] /api/v1/songs
export const index = async (req: Request, res: Response) => {
  const { searchKey, currentPage, perPage } = req.query;
  const currentPageValue = parseInt(currentPage as string) || 1;
  const perPageValue = parseInt(perPage as string) || null;

  let query = {};
  if (searchKey) {
    query = {
      slug: new RegExp(convertToSlug(searchKey as string), "i"),
    };
  }

  try {
    const songs = await Song.find({
      ...query,
      status: "active",
      deleted: false,
    })
      .skip((currentPageValue - 1) * perPageValue)
      .limit(perPageValue);

    res.status(200).json({ songs: songs });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// [GET] /api/v1/songs/detail/:idSong
export const detail = async (req: Request, res: Response) => {
  const { idSong } = req.params;
  if (!idSong) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const song = await Song.findOne({
      _id: new mongoose.Types.ObjectId(idSong),
      status: "active",
      deleted: false,
    });

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.status(200).json({ song });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
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

    res.status(200).json({
      message: "Song updated successfully",
      song,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// [DELETE] /api/v1/songs/delete/:idSong
export const deleteSong = async (req: Request, res: Response) => {
  const { idSong } = req.params;

  try {
    const song = await Song.findById(new mongoose.Types.ObjectId(idSong));

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    song.deleted = true;
    await song.save();

    res.status(200).json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// [GET] /api/v1/songs/:slugTopic
export const songsByTopic = async (req: Request, res: Response) => {
  const { slugTopic } = req.params;

  try {
    const songs = await Song.find({
      status: "active",
      deleted: false,
    })
      .populate({ path: "topic", match: { slug: slugTopic } })
      .populate("singer");

    if (!songs) {
      return res.status(404).json({
        message: "Songs not found",
      });
    }

    res.status(200).json({ songs });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// [GET] /api/v1/songs/singer/:slugSinger
export const songsBySinger = async (req: Request, res: Response) => {
  const { slugSinger } = req.params;

  try {
    const songs = await Song.find({
      status: "active",
      deleted: false,
    })
      .populate({ path: "singer", match: { slug: slugSinger } })
      .populate("topic");

    if (!songs) {
      return res.status(404).json({
        message: "Songs not found",
      });
    }

    res.status(200).json({ songs });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
