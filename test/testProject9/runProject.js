// import mongodb from "mongodb";
import expressGraphql from "express-graphql";
// import resolvers from "./graphQL/resolver.js";
// import schema from "./graphQL/schema.js";
// import { makeExecutableSchema } from "graphql-tools";
import express from "express";
import spinUp from "./spinUp.js";

const { graphqlHTTP } = expressGraphql;

Promise.resolve(spinUp()).then(({ db, client, schema, queryAndMatchArray }) => {
  const app = express();

  const root = {
    db,
    client
  };

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
      rootValue: root
    })
  );
  app.listen(3000);
});
