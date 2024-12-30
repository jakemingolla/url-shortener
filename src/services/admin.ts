import { Elysia, t } from "elysia";
import { version } from "../../package.json";

export const admin = new Elysia()
  .get("/health-check", () => "ok" as const, {
    detail: {
      summary: "Checks if the server is running",
      tags: ["admin"],
    },
    response: t.Literal("ok"),
  })
  .get("/version", () => version, {
    detail: {
      summary: "Returns the current version of the application",
      tags: ["admin"],
    },
    response: t.String(),
  });
