import spinUp from "./spinUp";

let db, schema, queryAndMatchArray, runMutation;
beforeAll(async () => {
  ({ db, schema, queryAndMatchArray, runMutation } = await spinUp());

  await db.collection("books").insert({ title: "Book 1", isRead: true });
  await db.collection("books").insert({ title: "Book 2", isRead: false });
  await db.collection("books").insert({ title: "Book 3", isRead: true });
});

afterAll(async () => {
  await db.collection("books").remove({});
  db.close();
  db = null;
});

test("Bool match true", async () => {
  await queryAndMatchArray({
    query: "{allBooks(isRead: true, SORT: {title: 1}){Books{title}}}",
    coll: "allBooks",
    results: [{ title: "Book 1" }, { title: "Book 3" }]
  });
});

test("Bool match false", async () => {
  await queryAndMatchArray({ query: "{allBooks(isRead: false, SORT: {title: 1}){Books{title}}}", coll: "allBooks", results: [{ title: "Book 2" }] });
});
