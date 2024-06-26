import { Song } from "../models/song.model";
import { Topic } from "../models/topic.model";
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
      perPage = perPage || null;

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

    getDetailSong: async (_, { slug }) => {
      const song = await Song.findOne({
        slug,
        status: "active",
        deleted: false,
      })
        .populate("topic", "title")
        .populate("singer", "fullName");

      if (!song) {
        return {
          code: 404,
          message: "Song not found!",
        };
      }
      return {
        code: 200,
        message: "Success!",
        song
      }
    },

    getSongsByTopic: async (_, { topicSlug }) => {
      try {
        const topicId = await Topic.find({ slug: topicSlug }).select("_id");
        if (!topicId)
          return {
            code: 404,
            message: "Topic not found!",
          };

        const songs = await Song.find({
          topic: topicId,
          status: "active",
          deleted: false,
        })
          .populate("topic", "title")
          .populate("singer", "fullName");

        return songs;
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          message: "Internal server error!",
        };
      }
    },
  },

  // Mutation: {
  //   createSong: async (_, { song }) => {
  //     const newSong = await Song.create(song);

  //     return newSong;
  //   },

  //   deleteSong: async (_, { id }) => {
  //     try {
  //       const song = await Song.findById(id);

  //       if (!song) {
  //         return {
  //           code: 404,
  //           message: "Song not found!",
  //         };
  //       }
  
  //       song.deleted = true;
  //       await song.save();
  
  //       return {
  //         code: 200,
  //         message: "Song deleted successfully!",
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         code: 500,
  //         message: "Internal server error!",
  //       };
  //     }
  //   },

  //   updateSong: async (_, { id, song }) => {
  //     const songUpdated = await Song.findByIdAndUpdate(id, song);

  //     return songUpdated;
  //   },
  // },
};
