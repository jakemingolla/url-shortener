import { RedirectsDatasource } from "@/datasources/redirects";
import type { DB } from "@/db/types";
import { expect, test, afterEach, mock, beforeEach } from "bun:test";
import type { Mock } from "bun:test";
import type { Kysely, Selectable } from "kysely";
import type { Redirect } from "@/db/types";

const mockedRedirects: Record<string, Selectable<Redirect>> = {};
const mockDb = mock();

const redirects = new RedirectsDatasource(mockDb as unknown as Kysely<DB>);
redirects.getRedirect = mock().mockImplementation((id) => {
  return mockedRedirects[id];
});

beforeEach(() => {
  for (let i = 0; i < 102; i++) {
    const id = i.toString();
    mockedRedirects[id] = {
      id,
      destination: `http://localhost:3000/r/${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      hits: 0,
      pk: i,
      deletedAt: null,
    };
  }
});

afterEach(() => {
  Object.keys(mockedRedirects).forEach((key) => {
    delete mockedRedirects[key];
  });
});

test("detects loop", async () => {
  expect(redirects.detectLoop("5", "http://localhost:3000/r/0")).resolves.toBe(
    true,
  );
});

test.only("loop limit exceeded", async () => {
  // Because the beforeEach already created a (non-looping) chain of 101
  // redirects (over the loop detection limit), any attempt to modify the
  // existing chain will be detected as a loop.
  expect(redirects.detectLoop("0", "http://localhost:3000/r/1")).resolves.toBe(
    true,
  );
});
