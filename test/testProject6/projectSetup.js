import { StringType, StringArrayType, IntType, MongoIdType } from "../../src/dataTypes.js";
import path from "path";

import { fileURLToPath } from 'url';
let fileName = fileURLToPath(import.meta.url);
let dirName = path.dirname(fileName);

const fields = {
  field1: StringType,
  field2: StringType,
  autoAdjustField: IntType,
  poisonField: IntType,
  autoUpdateField: IntType,
  userId: IntType
};

export const Type1 = {
  table: "type1",
  fields
};

export const Type2 = {
  table: "type2",
  fields
};

export const UpdateInfo = {
  table: "updateInfo",
  fields: {
    updatedId: MongoIdType,
    x: IntType
  }
};

export const InsertInfo = {
  table: "insertInfo",
  fields: {
    insertedId: MongoIdType,
    y: IntType
  }
};

export const DeleteInfo = {
  table: "deleteInfo",
  fields: {
    deletedId: MongoIdType,
    x: IntType
  }
};

export const JunkItem = {
  relationships: {
    _junk: {
      get type() {
        return InsertInfo;
      },
      fkField: "_junk"
    }
  }
};

export const Coordinate = {
  table: "coordinates",
  fields: {
    x: IntType,
    y: IntType
  },
  relationships: {
    _junk: {
      get type() {
        return DeleteInfo;
      },
      fkField: "_junk"
    }
  },
  resolvedFields: {
    pointAbove: "Coordinate",
    allNeighbors: "[Coordinate]"
  },
  extras: {
    resolverSources: [path.join(dirName, "graphQL-extras/coordinateResolverExtras")],
    schemaSources: [path.join(dirName, "graphQL-extras/coordinateSchemaExtras")],
    overrides: ["getCoordinate", "updateCoordinate"]
  }
};
