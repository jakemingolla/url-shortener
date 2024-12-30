import { Elysia } from "elysia";
import { RedirectsDatasource } from "@/datasources/redirects";
import { db } from "@/db";
export const runtime = new Elysia()
  .decorate("datasource", new RedirectsDatasource(db))
  .get(
    "/r/:id",
    async ({ params: { id }, redirect: goto, datasource, error }) => {
      const redirect = await datasource.getRedirect(id);

      if (redirect) {
        await datasource.addRedirectHit(id);
        return goto(redirect.destination);
      } else {
        return error(404);
      }
    },
    {
      detail: {
        summary: "Redirects to a destination URL",
        tags: ["redirects"],
      },
    },
  );
