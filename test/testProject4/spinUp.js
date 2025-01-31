import mongodb from "mongodb";
import { queryAndMatchArray, runQuery, runMutation, nextConnectionString } from "../testUtil.js";
import { makeExecutableSchema } from "graphql-tools";
import { createGraphqlSchema, settings } from "../../src/module.js";
import path from "path";
import glob from "glob";
import fs from "fs";

import * as projectSetupD from "./projectSetup.js";
import { fileURLToPath } from 'url';
let fileName = fileURLToPath(import.meta.url);
let dirName = path.dirname(fileName);

const { MongoClient } = mongodb;

export async function create() {
  await Promise.resolve(
    createGraphqlSchema(projectSetupD, path.resolve("./test/testProject4"), { hooks: path.resolve(dirName, "./projectSetup_Hooks.js") })
  ).then(() => {
    if (true || process.env.InCI) {
      glob.sync("./test/testProject4/graphQL/**/resolver.js").forEach(f => {
        let newFile = fs.readFileSync(f, { encoding: "utf8" }).replace(/"mongo-graphql-starter"/, `"../../../../src/module"`);
        fs.writeFileSync(f, newFile);
      });
    }
  });
}

export default async function() {
  await create();

  if (process.env.PREFER_LOOKUP) {
    settings.setPreferLookup(true);

    console.log(
      "******************************************************************\n",
      "******************************************************************\n",
      "******************************************************************\n",

      "\nPreferring $lookup\n\n",

      "******************************************************************\n",
      "******************************************************************\n",
      "******************************************************************\n"
    );
  }

  const [{ default: resolvers }, { default: typeDefs }] = await Promise.all([import("./graphQL/resolver"), import("./graphQL/schema")]);

  let db, schema;
  let client = await MongoClient.connect(nextConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db(process.env.databaseName || "mongo-graphql-starter");
  schema = makeExecutableSchema({ typeDefs, resolvers, initialValue: { db: {} } });

  return {
    db,
    schema,
    close: () => client.close(),
    queryAndMatchArray: options => queryAndMatchArray({ schema, db, ...options }),
    runQuery: options => runQuery({ schema, db, ...options }),
    runMutation: options => runMutation({ schema, db, ...options })
  };
}
