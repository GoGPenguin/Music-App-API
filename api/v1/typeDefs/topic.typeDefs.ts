import { gql } from "apollo-server-express";

export const typeDefsTopic = gql`
  type Topic {
    id: ID!
    title: String!
    avatar: String!
    description: String!
    status: String!
    slug: String!
    code: Int
    message: String
  }

  input TopicInput {
    currentPage: Int,
    perPage: Int,
  }

  type Query {
    getTopics(topicInput: TopicInput): [Topic]
    getTopTopics(amount: Int): [Topic]
  }
`;

