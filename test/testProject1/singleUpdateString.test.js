import spinUp from "./spinUp";

let db, schema, queryAndMatchArray, runMutation;
beforeEach(async () => {
  ({ db, schema, queryAndMatchArray, runMutation } = await spinUp());

  await db.collection("tags").insert({ _id: "a", name: "Tag 1", count: 100 });
  await db.collection("tags").insert({ _id: "b", name: "Tag 2", count: 150 });
  await db.collection("tags").insert({ _id: "c", name: "Tag 3", count: 200 });
});

afterEach(async () => {
  await db.collection("tags").remove({});
  db.close();
  db = null;
});

test("Bulk update 1", async () => {
  let tags = await db
    .collection("tags")
    .find({ count: { $gt: 150 } }, { _id: 1 })
    .toArray();

  let results = await runMutation({
    mutation: `updateTag(_id: "${tags[0]._id}", Tag: {count: 99}){Tag{count}}`,
    result: "updateTag"
  });

  expect(results).toEqual({ count: 99 });

  await queryAndMatchArray({
    query: "{allTags(SORT: { name: 1 }){Tags{name, count}}}",
    coll: "allTags",
    results: [{ name: "Tag 1", count: 100 }, { name: "Tag 2", count: 150 }, { name: "Tag 3", count: 99 }]
  });
});
