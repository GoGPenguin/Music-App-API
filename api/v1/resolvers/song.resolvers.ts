import { Song } from "../models/song.model";

export const resolversSong = {
  Query: {
    getAllSongs: async () => {
      const songs = await Song.find({
        status: "active",
        deleted: false,
      })
        .populate("topic")
        .populate("singer");

      return songs;
    },

    getDetailSong: async (_, { id }) => {
      const song = await Song.findById(id).populate("topic").populate("singer");

      return song;
    },
  },

  Mutation: {
    createSong: async (_, { song }) => {
      const newSong = await Song.create(song);

      return newSong;
    },

    deleteSong: async (_, { id }) => {
      const song = await Song.findById(id);

      if (!song) {
        throw new Error("Song not found!");
      }

      song.deleted = true;
      await song.save();

      return "Song deleted!";
    },

    updateSong: async (_, { id, song }) => {
      const songUpdated = await Song.findByIdAndUpdate(id, song);
      
      return songUpdated;
    },
  },
};
