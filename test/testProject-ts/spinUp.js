import mongodb from "mongodb";
import { queryAndMatchArray, runQuery, runMutation, nextConnectionString } from "../testUtil.js";
import { makeExecutableSchema } from "graphql-tools";
import { createGraphqlSchema } from "../../src/module.js";
import path from "path";
import glob from "glob";
import fs from "fs";

import * as projectSetupTS from "./projectSetup.js";
import dotenv from "dotenv";
dotenv.config();

export async function create() {
  await createGraphqlSchema(projectSetupTS, path.resolve("./test/testProject-ts"), {
    typings: path.resolve("./test/testProject-ts/graphql-types.ts")
  });
}

export default async function() {
  try {
    await create();
  } catch (err) {
    console.log("ERROR SPINNING UP PROJECT TS:", err);
    throw err;
  }
}
