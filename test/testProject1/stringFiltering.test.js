import spinUp from "./spinUp";

let db, schema, queryAndMatchArray, runMutation;
beforeAll(async () => {
  ({ db, schema, queryAndMatchArray, runMutation } = await spinUp());

  await db.collection("books").insert({ title: "Book 1" });
  await db.collection("books").insert({ title: "Second Book" });
  await db.collection("books").insert({ title: "Title x 1" });
});

afterAll(async () => {
  await db.collection("books").remove({});
  db.close();
  db = null;
});

test("String match", async () => {
  await queryAndMatchArray({ query: '{allBooks(title: "Book 1"){Books{title}}}', coll: "allBooks", results: [{ title: "Book 1" }] });
});

test("String_ne match", async () => {
  await queryAndMatchArray({
    query: '{allBooks(title_ne: "Book 1", SORT: { title: 1 }){Books{title}}}',
    coll: "allBooks",
    results: [{ title: "Second Book" }, { title: "Title x 1" }]
  });
});

test("String in", async () => {
  await queryAndMatchArray({
    schema,
    db,
    query: '{allBooks(title_in: ["X", "Book 1", "Y"]){Books{title}}}',
    coll: "allBooks",
    results: [{ title: "Book 1" }]
  });
});

test("String startsWith", async () => {
  await queryAndMatchArray({ query: '{allBooks(title_startsWith: "B"){Books{title}}}', coll: "allBooks", results: [{ title: "Book 1" }] });
});

test("String endsWith", async () => {
  await queryAndMatchArray({ query: '{allBooks(title_endsWith: "k"){Books{title}}}', coll: "allBooks", results: [{ title: "Second Book" }] });
});

test("String contains", async () => {
  await queryAndMatchArray({ query: '{allBooks(title_contains: "x"){Books{title}}}', coll: "allBooks", results: [{ title: "Title x 1" }] });
});
