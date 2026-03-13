import { ApolloServer } from "apollo-server-express";
import express from "express";
import { typeDefs } from "../modules/category/graphql/category.typeDefs";
import { resolvers } from "../modules/category/graphql/category.resolvers";
import { CategoryModule } from "../modules/category/category.module";

export const startGraphQL = async (app: express.Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => ({
      service: CategoryModule.service,
    }),
  });

  await server.start();
  server.applyMiddleware({ 
    app: app as any, 
    path: "/graphql",
    cors: true
  });

  console.log("GraphQL server ready at /graphql");
};