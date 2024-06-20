import { Song } from "../models/song.model";
import { convertToSlug } from "../../../helper/convertToSlug";

export const resolversSong = {
  Query: {
    getAllSongs: async (
      _,
      { sortKey, sortValue, currentPage, perPage, filter, search }
    ) => {
      const sort = {};
      if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
      }

      currentPage = currentPage || 1;
      perPage = perPage || 10;

      const filterField = {};

      if (filter && filter.length > 0) {
        for (let i = 0; i < filter.length; i++) {
          if (filter[i].key === "title") {
            filter[i].key = "slug";
            filterField[filter[i].key] = new RegExp(
              convertToSlug(filter[i].value),
              "i"
            );
          } else filterField[filter[i].key] = filter[i].value;
        }
      }

      if (search) {
        const stringSlug = convertToSlug(search.toString());
        const slugRegex = new RegExp(stringSlug, "i");
        const keywordRegex = new RegExp(search.toString(), "i");
        filterField["$or"] = [
          {
            slug: slugRegex,
          },
          {
            title: keywordRegex,
          },
        ];
      }

      const songs = await Song.find({
        ...filterField,
        status: "active",
        deleted: false,
      })
        .sort(sort)
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
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
