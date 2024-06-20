import { gql } from "apollo-server-express";

export const typeDefsSong = gql`
  type Song {
    id: ID!
    title: String!
    avatar: String!
    description: String!
    topic: Topic!
    singer: Singer!
    audio: String!
  }

  type Topic {
    id: ID!
    title: String!
  }

  type Singer {
    id: ID!
    fullName: String!
  }

  input SongInput {
    title: String!
    avatar: String!
    description: String!
    topic: ID!
    singer: ID!
    audio: String!
  }

  input Filter {
    key: String!
    value: String!
  }

  type Query {
    getAllSongs(
      sortKey: String
      sortValue: String
      currentPage: Int
      perPage: Int
      filter: [Filter],
      search: String
    ): [Song]
    getDetailSong(id: ID): Song
  }

  type Mutation {
    createSong(song: SongInput!): Song
    deleteSong(id: ID!): String
    updateSong(id: ID!, song: SongInput!): Song
  }
`;
