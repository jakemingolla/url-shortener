import { version } from "../package.json";
import { Elysia } from "elysia";
import { db } from "./db/bun";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger())
  .decorate("db", db)
  .get("/api/health-check", () => "ok")
  .get("/api/version", () => version)
  .get("/api/count", ({ db }) => {
    const count = db.query("SELECT count(*) as count FROM redirects").get();
    return count;
  })
  .get("/api/redirects/test-add", () => {
    const query = db.query(
      "INSERT INTO redirects (destination, id) VALUES ('https://google.com', '123')",
    );
    query.run();
    return "ok";
  });

const server = app.listen(3000);

console.log(`Listening on http://localhost:3000`);
