import spinUp from "./spinUp";

let db, schema, queryAndMatchArray, runMutation;
beforeAll(async () => {
  ({ db, schema, queryAndMatchArray, runMutation } = await spinUp());

  await db.collection("books").insert({ title: "Book 1", pages: 100 });
  await db.collection("books").insert({ title: "Second Book", pages: 150 });
  await db.collection("books").insert({ title: "Title x 1", pages: 200 });
});

afterAll(async () => {
  await db.collection("books").remove({});
  db.close();
  db = null;
});

test("OR filters 1", async () => {
  await queryAndMatchArray({
    query: '{allBooks(OR: [{title: "Book 1"}]){title, pages}}',
    coll: "allBooks",
    results: [{ title: "Book 1", pages: 100 }]
  });
});

test("OR filters 2", async () => {
  await queryAndMatchArray({
    query: '{allBooks(title: "Book 1", OR: [{title: "XXXXXX"}, {title: "Book 1"}]){title, pages}}',
    coll: "allBooks",
    results: [{ title: "Book 1", pages: 100 }]
  });
});

test("OR filters 3", async () => {
  await queryAndMatchArray({
    query: '{allBooks(title: "Book 1", OR: [{title: "XXXXXX"}, {title: "Book 1", OR: [{pages: 100}]}]){title, pages}}',
    coll: "allBooks",
    results: [{ title: "Book 1", pages: 100 }]
  });
});

test("OR filters 4", async () => {
  await queryAndMatchArray({
    query: '{allBooks(title: "Book 1", OR: [{title: "XXXXXX"}, {title: "Book 1", OR: [{title: "XXX"}, {pages: 100}]}]){title, pages}}',
    coll: "allBooks",
    results: [{ title: "Book 1", pages: 100 }]
  });
});

test("OR filters 5 - AND and OR", async () => {
  await queryAndMatchArray({
    query: '{allBooks(title: "Book 1", OR: [{title: "XXXXXX"}, {title: "Book 1", OR: [{pages: 101}]}]){title, pages}}',
    coll: "allBooks",
    results: []
  });
});
