import { Elysia, error, t } from "elysia";
import { RedirectsDatasource } from "@/datasources/redirects";
import { db } from "@/db";

export const redirects = new Elysia()
  .decorate("datasource", new RedirectsDatasource(db))
  .get("/redirects/:id", async ({ params: { id }, datasource, error }) => {
    const redirect = await datasource.getRedirect(id);
    return redirect || error(404);
  })
  .post(
    "/redirects",
    async ({ body: { destination }, datasource }) => {
      const id = await datasource.createRedirect(destination);
      return { id };
    },
    {
      body: t.Object({
        destination: t.String(),
      }),
    },
  )
  .delete(
    "/redirects/:id",
    async ({ params: { id }, datasource }) => {
      await datasource.softDeleteRedirect(id);
      return { id };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .patch(
    "/redirects/:id",
    async ({ params: { id }, body: { destination }, datasource }) => {
      if (await datasource.detectLoop(id, destination)) {
        return error(400, "Redirect loop detected.");
      }

      await datasource.updateDestination(id, destination);
      return { id };
    },
    {
      body: t.Object({
        destination: t.String(),
      }),
    },
  );
