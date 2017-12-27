import spinUp from "./spinUp";

let db, schema, queryAndMatchArray, runMutation;
beforeEach(async () => {
  ({ db, schema, queryAndMatchArray, runMutation } = await spinUp());

  await db.collection("books").insert({ title: "Book 1", pages: 100 });
  await db.collection("books").insert({ title: "Book 2", pages: 150 });
  await db.collection("books").insert({ title: "Book 3", pages: 200 });
});

afterEach(async () => {
  await db.collection("books").remove({});
  db.close();
  db = null;
});

test("Bulk update 1", async () => {
  await runMutation({
    mutation: `updateBooks(Match: {pages_gt: 100}, Book: {pages: 99})`,
    result: "updateBooks"
  });

  await queryAndMatchArray({
    query: "{allBooks(SORT: { title: 1 }){Books{title, pages}}}",
    coll: "allBooks",
    results: [{ title: "Book 1", pages: 100 }, { title: "Book 2", pages: 99 }, { title: "Book 3", pages: 99 }]
  });
});
