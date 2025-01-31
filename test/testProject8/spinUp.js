import mongodb from "mongodb";
import { queryAndMatchArray, runMutation, nextConnectionString } from "../testUtil.js";
import { makeExecutableSchema } from "graphql-tools";
import { createGraphqlSchema } from "../../src/module.js";
import path from "path";
import glob from "glob";
import fs from "fs";

import * as projectSetupH from "./projectSetup.js";

const { MongoClient } = mongodb;

export async function create() {
  await createGraphqlSchema(projectSetupH, path.resolve("./test/testProject8"));

  if (true || process.env.InCI) {
    glob.sync("./test/testProject8/graphQL/**/resolver.js").forEach(f => {
      let newFile = fs.readFileSync(f, { encoding: "utf8" }).replace(/"mongo-graphql-starter"/, `"../../../../src/module"`);
      fs.writeFileSync(f, newFile);
    });
  }
}

export default async function() {
  await create();

  const [{ default: resolvers }, { default: typeDefs }] = await Promise.all([import("./graphQL/resolver"), import("./graphQL/schema")]);

  let db, schema;
  let client = await MongoClient.connect(
    nextConnectionString(),
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  db = client.db(process.env.databaseName || "mongo-graphql-starter");
  schema = makeExecutableSchema({ typeDefs, resolvers, initialValue: { db: {} } });

  return {
    db,
    schema,
    close: () => client.close(),
    runQuery: options => runQuery({ schema, db, ...options }),
    queryAndMatchArray: options => queryAndMatchArray({ schema, db, ...options }),
    runMutation: options => runMutation({ schema, db, ...options })
  };
}
