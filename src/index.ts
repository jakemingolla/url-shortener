import { version } from "../package.json";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { admin } from "@/services/admin";
import { redirects } from "@/services/redirects";
import { runtime } from "@/services/runtime";

const app = new Elysia()
  .use(swagger())
  .group("/api/v1", (app) => app.use(admin).use(redirects))
  .use(runtime);

const server = app.listen(3000);

console.log(`Listening on http://localhost:3000`);
