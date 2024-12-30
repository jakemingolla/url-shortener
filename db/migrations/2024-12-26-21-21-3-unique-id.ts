import type { Kysely } from "kysely";

import type { DB } from "../../src/db/types";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createIndex("url_shortener.redirects_unique_id_idx")
    .on("url_shortener.redirects")
    .column("id")
    .unique()
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("url_shortener.redirects_unique_id_idx").execute();
}
