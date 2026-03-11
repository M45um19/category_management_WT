import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Category {
    _id: ID!
    name: String!
    level: Int!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
    parent: Category
    children: [Category]
  }

  type Query {
    categories: [Category]
    category(id: ID, name: String): Category
    children(parentId: ID!): [Category]
  }
`;