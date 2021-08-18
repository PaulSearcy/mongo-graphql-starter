import mongodb from "mongodb";
import { queryAndMatchArray, runQuery, runMutation, nextConnectionString } from "../testUtil.js";
import { makeExecutableSchema } from "graphql-tools";
import { createGraphqlSchema } from "../../src/module.js";
import path from "path";
import glob from "glob";
import fs from "fs";
import { fileURLToPath } from 'url';

import * as projectSetup9 from "./projectSetup.js";
import dotenv from "dotenv";

let fileName = fileURLToPath(import.meta.url);
let dirName = path.dirname(fileName);

const { MongoClient } = mongodb;
dotenv.config();

export async function create() {
  await Promise.resolve(
    createGraphqlSchema(projectSetup9, path.resolve("./test/testProject9"), { hooks: path.resolve(dirName, "./projectSetup_Hooks.js") })
  ).then(() => {
    if (true || process.env.InCI) {
      glob.sync("./test/testProject9/graphQL/**/resolver.js").forEach((f) => {
        let newFile = fs.readFileSync(f, { encoding: "utf8" }).replace(/"mongo-graphql-starter"/, `"../../../../src/module.js"`);
        fs.writeFileSync(f, newFile);
      });
    }
  });
}

export default async function () {
  await create();

  const [{ default: resolvers }, { default: typeDefs }] = await Promise.all([import("./graphQL/resolver.js"), import("./graphQL/schema.js")]);

  let db, schema;
  let client = await MongoClient.connect(nextConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db(process.env.databaseName || "mongo-graphql-starter");
  schema = makeExecutableSchema({ typeDefs, resolvers, initialValue: { db: {} } });

  return {
    db,
    client,
    schema,
    close: () => client.close(),
    queryAndMatchArray: (options) => queryAndMatchArray({ schema, db, ...options }),
    runQuery: (options) => runQuery({ schema, db, ...options }),
    runMutation: (options) => runMutation({ schema, db, client, ...options }),
  };
}
