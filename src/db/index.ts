import { Kysely, PostgresDialect, WithSchemaPlugin } from "kysely";
import type { DB } from "./types";
import pg from "pg";

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT ?? "5432"),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  }),
});

export const db = new Kysely<DB>({
  dialect,
  plugins: [new WithSchemaPlugin("url_shortener")],
});
