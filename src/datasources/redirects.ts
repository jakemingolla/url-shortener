import type { DB } from "@/db/types";
import type { Kysely } from "kysely";
import { exposedRedirectColumns } from "@/db/public-types";
import { sql } from "kysely";
import crypto from "crypto";

// If a chain of redirects with destination URLs containing redirect IDs
// exceeds this limit, we will consider it a loop and return an error.
const loopDetectionLimit = 100;

// Regex to extract a redirect ID from a URL
const extractRedirectIDRegex = /.*\/r\/([a-z0-9-]+)$/;

export class RedirectsDatasource {
  constructor(private readonly db: Kysely<DB>) {}

  /**
   * Gets a redirect by id
   * @param id - The id of the redirect
   * @returns The redirect or undefined if it doesn't exist
   */
  async getRedirect(id: string) {
    return await this.db
      .selectFrom("redirects")
      .select(exposedRedirectColumns)
      .where("id", "=", id)
      .where("deletedAt", "is", null)
      .executeTakeFirst();
  }

  /**
   * Creates a new redirect
   * @param destination - The destination URL
   * @returns The id of the new redirect
   */
  async createRedirect(destination: string) {
    const id = crypto.randomUUID();

    await this.db.insertInto("redirects").values({ id, destination }).execute();

    return id;
  }

  /**
   * Adds a hit to a redirect
   * @param id - The id of the redirect
   * @returns The id of the redirect
   */
  async addRedirectHit(id: string) {
    const now = new Date();

    return await this.db
      .updateTable("redirects")
      .set({ hits: sql<number>`${sql.raw("hits")} + 1`, updatedAt: now })
      .where("id", "=", id)
      .where("deletedAt", "is", null)
      .execute();
  }

  /**
   * Updates the destination of a redirect
   * @param id - The id of the redirect
   * @param destination - The new destination URL
   * @returns The id of the redirect
   */
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

  /**
   * Soft deletes a redirect
   * @param id - The id of the redirect
   * @returns The id of the redirect
   */
  async softDeleteRedirect(id: string) {
    const now = new Date();

    await this.db
      .updateTable("redirects")
      .set({ deletedAt: now, updatedAt: now })
      .where("id", "=", id)
      .execute();

    return id;
  }

  /**
   * Detects a loop in a redirect chain. A loop is detected if:
   * - The destination URL contains a redirect ID that has already been seen
   * - The number of redirects in the chain exceeds the loop detection limit
   * @param id - The id of the redirect
   * @param destination - The destination URL
   * @returns Whether a loop was detected
   */
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
