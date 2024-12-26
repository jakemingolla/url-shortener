import { Database } from "bun:sqlite";

export const db = new Database("./local-development/db/db.sqlite");
