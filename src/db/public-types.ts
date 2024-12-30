import type { Selectable } from "kysely";
import type { Redirect } from "./types";
import { t } from "elysia";

// Columns that are exposed to clients (ignores primary key).
export const exposedRedirectColumns = [
  "id",
  "destination",
  "hits",
  "createdAt",
  "updatedAt",
  "deletedAt",
] as const satisfies (keyof Selectable<Redirect>)[];

export const publicRedirectSchema = t.Object({
  id: t.String({
    description: "The identifierof the redirect",
  }),
  destination: t.String({
    description: "The destination URL to redirect to",
  }),
  hits: t.Number({
    description: "The number of times the redirect has been used",
  }),
  createdAt: t.Date({
    format: "date-time",
    description: "The date the redirect was created",
  }),
  updatedAt: t.Date({
    format: "date-time",
    description: "The date the redirect was last updated",
  }),
  deletedAt: t.Any({
    description: "The date the redirect was deleted",
  }),
});
