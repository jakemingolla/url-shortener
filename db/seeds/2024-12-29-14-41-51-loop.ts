import type { Kysely } from "kysely";
import type { DB } from "../../src/db/types";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db
    .insertInto("redirects")
    .values([
      {
        id: "loop",
        destination: "http://localhost:3000/r/loop2",
      },
      {
        id: "loop2",
        destination: "http://localhost:3000/r/loop",
      },
    ])
    .execute();
}
