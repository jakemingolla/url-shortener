import { Elysia } from "elysia";
import { version } from "../../package.json";

export const admin = new Elysia()
  .get("/health-check", () => "ok")
  .get("/version", () => version);
