import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { DB } from "../../src/db/types";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("redirects")
    .addColumn("pk", "serial", (col) => col.primaryKey().notNull())
    .addColumn("id", "text", (col) => col.notNull())
    .addColumn("destination", "text", (col) => col.notNull())
    .addColumn("hits", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("redirects").execute();
}
