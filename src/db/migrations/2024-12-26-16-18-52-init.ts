import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("redirects")
    .addColumn("pk", "integer", (col) => col.primaryKey().notNull())
    .addColumn("id", "text", (col) => col.notNull())
    .addColumn("destination", "text", (col) => col.notNull())
    .addColumn("hits", "integer", (col) => col.defaultTo(0).notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("deleted_at", "timestamptz")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("redirects").execute();
}
