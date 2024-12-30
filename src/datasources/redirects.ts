import type { DB, Redirect } from "@/db/types";
import type { Kysely, Selectable } from "kysely";
import { sql } from "kysely";
import crypto from "crypto";

const loopDetectionLimit = 100;
const extractRedirectIDRegex = /.*\/r\/([a-z0-9-]+)$/;

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

  async detectLoop(id: string, destination: string) {
    const seen: string[] = [id];
    let match: RegExpExecArray | null = null;
    let count = 0;

    while ((match = extractRedirectIDRegex.exec(destination))) {
      if (!match) {
        return false;
      }

      if (count > loopDetectionLimit) {
        return true; // or error?
      }

      id = match[1];

      if (seen.includes(id)) {
        return true;
      } else {
        seen.push(id);
      }

      const redirect = await this.getRedirect(id);
      if (!redirect) {
        return false;
      }

      destination = redirect.destination;
      count++;
    }
    return false;
  }
}
