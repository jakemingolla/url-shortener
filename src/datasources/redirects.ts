import type { DB, Redirect } from "@/db/types";
import type { Insertable, Kysely, Selectable } from "kysely";
import { sql } from "kysely";
import crypto from "crypto";

export class RedirectsDatasource {
  constructor(private readonly db: Kysely<DB>) {}

  async getRedirect(id: string): Promise<Selectable<Redirect> | undefined> {
    return await this.db
      .selectFrom("redirects")
      .selectAll()
      .where("id", "=", id)
      .where("deletedAt", "is", null)
      .executeTakeFirst();
  }

  async createRedirect(destination: string) {
    const id = crypto.randomUUID();

    await this.db.insertInto("redirects").values({ id, destination }).execute();

    return id;
  }

  async addRedirectHit(id: string) {
    const now = new Date();

    return await this.db
      .updateTable("redirects")
      .set({ hits: sql<number>`${sql.raw("hits")} + 1`, updatedAt: now })
      .where("id", "=", id)
      .where("deletedAt", "is", null)
      .execute();
  }

  async updateDestination(id: string, destination: string) {
    const now = new Date();

    await this.db
      .updateTable("redirects")
      .set({ destination, updatedAt: now })
      .where("id", "=", id)
      .where("deletedAt", "is", null)
      .execute();

    return id;
  }

  async softDeleteRedirect(id: string) {
    const now = new Date();

    await this.db
      .updateTable("redirects")
      .set({ deletedAt: now, updatedAt: now })
      .where("id", "=", id)
      .execute();

    return id;
  }
}
