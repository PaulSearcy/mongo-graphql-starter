import mongodb from "mongodb";
import expressGraphql from "express-graphql";
import resolvers from "./graphQL/resolver.js";
import schema from "./graphQL/schema.js";
import { makeExecutableSchema } from "graphql-tools";
import express from "express";
import conn from "./connection.js";

import spinUp from "./spinUp.js";
Promise.resolve(spinUp()).then(({ db, schema, queryAndMatchArray }) => {
  const app = express();
  const root = {
    db
  };

  app.use(
    "/graphql",
    expressGraphql({
      schema,
      graphiql: true,
      rootValue: root
    })
  );
  app.listen(3000);
});
