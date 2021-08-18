import { MongoIdType, StringType, arrayOf } from "../../src/dataTypes.js";

export const Tag = {
  table: "tags",
  fields: {
    _id: MongoIdType,
    tagName: StringType,
    get authors() {
      return arrayOf(Author);
    }
  }
};

export const Author = {
  table: "authors",
  fields: {
    name: StringType,
    tags: arrayOf(Tag)
  }
};
