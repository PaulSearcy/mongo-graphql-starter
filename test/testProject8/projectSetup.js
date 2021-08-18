import { IntArrayType, FloatArrayType, StringType, StringArrayType } from "../../src/dataTypes.js";

export const Thing = {
  table: "things",
  fields: {
    name: StringType,
    strs: StringArrayType,
    ints: IntArrayType,
    floats: FloatArrayType
  },
  manualQueryArgs: [{ name: "ManualArg", type: "String" }]
};
