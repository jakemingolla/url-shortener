import { Kysely } from "kysely";
import { BunWorkerDialect } from "kysely-bun-worker";

const dialect = new BunWorkerDialect({
  url: "./local-development/db/db.sqlite",
});

export const db = new Kysely({
  dialect,
});
