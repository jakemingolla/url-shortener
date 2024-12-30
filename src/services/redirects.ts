import { Elysia, error, t } from "elysia";
import { RedirectsDatasource } from "@/datasources/redirects";
import { publicRedirectSchema } from "@/db/public-types";
import { db } from "@/db";

export const redirects = new Elysia()
  .decorate("datasource", new RedirectsDatasource(db))
  .get(
    "/redirects/:id",
    async ({ params: { id }, datasource, error }) => {
      const redirect = await datasource.getRedirect(id);
      return redirect ?? error(404, { message: "Redirect not found" });
    },
    {
      detail: {
        summary: "Gets a redirect by id",
        tags: ["redirects"],
      },
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: publicRedirectSchema,
        404: t.Object({
          message: t.String(),
        }),
      },
    },
  )
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
      detail: {
        summary: "Creates a new redirect",
        tags: ["redirects"],
      },
      response: t.Object({
        id: t.String(),
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
      detail: {
        summary: "Deletes a redirect",
        tags: ["redirects"],
      },
      response: t.Object({
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
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        destination: t.String(),
      }),
      detail: {
        summary: "Updates a redirect's destination.",
        description:
          "Updates a redirect's destination. " +
          "Attempts to detect loops and will return a 400 error if a loop is detected.",
        tags: ["redirects"],
      },
    },
  );
