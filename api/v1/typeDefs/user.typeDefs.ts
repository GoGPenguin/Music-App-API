import { gql } from "apollo-server-express";

export const typeDefsUser = gql`
  type User {
    id: ID
    fullName: String
    email: String
    token: String
    code: Int
    message: String
  }

  input UserInput {
    fullName: String!
    email: String!
    password: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  type Query {
    getUserInfo: User
  }

  type Mutation {
    createUser(user: UserInput!): User
    loginUser(loginInput: loginInput!): User
  }
`;
