import mongodb from "mongodb";
import { queryAndMatchArray, runQuery, runMutation, nextConnectionString } from "../testUtil.js";
import { makeExecutableSchema } from "graphql-tools";
import { createGraphqlSchema } from "../../src/module.js";
import path from "path";
import glob from "glob";
import fs from "fs";
import mkdirp from "mkdirp";

import * as projectSetupF from "./projectSetup.js";

import { fileURLToPath } from 'url';
let fileName = fileURLToPath(import.meta.url);
let dirName = path.dirname(fileName);

const { MongoClient } = mongodb;

export async function create() {
  //TODO: this shit
  await Promise.resolve(
    createGraphqlSchema(projectSetupF, path.resolve("./test/testProject6"), {
      hooks: path.resolve(dirName, "./projectSetup_Hooks.js"),
      schemaAdditions: [
        path.resolve(dirName, "./graphQL-extras/schemaAdditions1.gql"),
        path.resolve(dirName, "./graphQL-extras/schemaAdditions2.gql")
      ],
      resolverAdditions: [
        path.resolve(dirName, "./graphQL-extras/resolverAdditions1"),
        path.resolve(dirName, "./graphQL-extras/resolverAdditions2")
      ]
    })
  ).then(() => {
    if (!fs.existsSync("./test/testProject6/graphQL-extras")) {
      mkdirp.sync("./test/testProject6/graphQL-extras");
    }
    fs.writeFileSync(
      path.resolve("./test/testProject6/graphQL-extras/coordinateSchemaExtras.js"),
      fs.readFileSync(path.resolve(dirName, "./projectSetup_SchemaExtras.js"), { encoding: "utf8" })
    );
    fs.writeFileSync(
      path.resolve("./test/testProject6/graphQL-extras/coordinateResolverExtras.js"),
      fs.readFileSync(path.resolve(dirName, "./projectSetup_ResolverExtras.js"), { encoding: "utf8" })
    );

    if (true || process.env.InCI) {
      glob.sync("./test/testProject6/graphQL/**/resolver.js").forEach(f => {
        let newFile = fs.readFileSync(f, { encoding: "utf8" }).replace(/"mongo-graphql-starter"/, `"../../../../src/module"`);
        fs.writeFileSync(f, newFile);
      });
    }
  });
}

export default async function () {
  await create();

  const [{ default: resolvers }, { default: typeDefs }] = await Promise.all([import("./graphQL/resolver"), import("./graphQL/schema")]);

  let db, schema;
  let client = await MongoClient.connect(nextConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true });
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
