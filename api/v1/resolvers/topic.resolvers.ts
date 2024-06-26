import { create } from "domain";
import { Topic } from "../models/topic.model";

export const resolversTopic = {
  Query: {
    getTopics: async (_, { topicInput }) => {
      try {
        let currentPage = 1;
        let perPage = null;
        if (topicInput) {
          currentPage = topicInput.currentPage || 1;
          perPage = topicInput.perPage || null;
        }

        const topics = await Topic.find({
          status: "active",
          deleted: false,
        })
          .skip((currentPage - 1) * perPage)
          .limit(perPage);

        return topics;
      } catch (error) {
        return {
          code: 500,
          message: error.message,
        };
      }
    },

    getTopTopics: async (_, { amount }) => {
      const topics = await Topic.find({
        status: "active",
        deleted: false,
      })
        .limit(amount);

      return topics;
    },
  },
};
