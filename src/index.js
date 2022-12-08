import startApolloServer from "./init/server";
import {makeExecutableSchema} from "@graphql-tools/schema";
import typeDefs from "../GraphQL/Schema/types.graphql";
import resolvers from "../GraphQL/Resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

startApolloServer(schema).then(r=>console.log(r))