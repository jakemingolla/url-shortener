import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { admin } from "@/services/admin";
import { redirects } from "@/services/redirects";
import { runtime } from "@/services/runtime";
import { version } from "../package.json";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "url-shortener",
          version,
        },
      },
    }),
  )
  .group("/api/v1", (app) => app.use(admin).use(redirects))
  .use(runtime);

app.listen(3000);

console.log(`Listening on http://localhost:3000`);
