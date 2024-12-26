import { Kysely } from "kysely";
import { BunWorkerDialect } from "kysely-bun-worker";
import type { DB } from "./types";

const dialect = new BunWorkerDialect({
  url: "./local-development/db/db.sqlite",
});

export const db = new Kysely<DB>({
  dialect,
});
