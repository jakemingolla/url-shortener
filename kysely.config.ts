import { defineConfig } from "kysely-ctl";
import type { DefineConfigInput } from "kysely-ctl";
import { db } from "./src/db";

const getMigrationPrefix = () => {
  const now = new Date();
  const year = now.getUTCFullYear().toString();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const second = now.getUTCSeconds();
  return `${year}-${month}-${day}-${hour}-${minute}-${second}-`;
};

const config: DefineConfigInput = {
  kysely: db,
  migrations: {
    migrationFolder: "src/db/migrations",
    getMigrationPrefix,
  },
};

export default defineConfig(config);
