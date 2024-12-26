import type { Kysely } from "kysely";
import type { DB } from "../../src/db/types";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db
    .insertInto("redirects")
    .values({
      id: "local",
      destination: "https://google.com",
    })
    .execute();
}
