import { version } from "../package.json";
import { Elysia } from "elysia";
// import { db } from "./db/bun";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";

const app = new Elysia()
  .use(swagger())
  .decorate("db", db)
  .get("/api/health-check", () => "ok")
  .get("/api/version", () => version)
  .get("/api/count", async ({ db }) => {
    const count = await db
      .selectFrom("redirects")
      .select(db.fn.countAll().as("count"))
      .executeTakeFirstOrThrow();
    return count;
  })
  .get("/api/redirects/test-get", async ({ db }) => {
    const redirects = await db.selectFrom("redirects").selectAll().execute();
    console.log(redirects);
    console.log(typeof redirects[0].updated_at);
    return redirects;
  })
  .get("/api/redirects/test-add", async ({ db }) => {
    const redirect = await db
      .insertInto("redirects")
      .values({
        destination: "https://google.com",
        id: "123",
        pk: 1,
      })
      .executeTakeFirstOrThrow();
    return redirect;
  });
// .get("/api/count", ({ db }) => {
//   const count = db.query("SELECT count(*) as count FROM redirects").get();
//   return count;
// })
// .get("/api/redirects/test-add", () => {
//   const query = db.query(
//     "INSERT INTO redirects (destination, id) VALUES ('https://google.com', '123')",
//   );
//   query.run();
//   return "ok";
// })
// .get("/api/redirects/test-get", () => {
//   const query = db.query("SELECT * FROM redirects");
//   const result = query.get();
//   return result;
// });

const server = app.listen(3000);

console.log(`Listening on http://localhost:3000`);
