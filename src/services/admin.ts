import { Elysia } from "elysia";
import { version } from "../../package.json";

export const admin = new Elysia()
  .get("/health-check", () => "ok", {
    detail: {
      summary: "Checks if the server is running",
      tags: ["admin"],
    },
  })
  .get("/version", () => version, {
    detail: {
      summary: "Returns the current version of the application",
      tags: ["admin"],
    },
  });
