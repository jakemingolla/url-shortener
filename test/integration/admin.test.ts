import { expect, test } from "bun:test";
import { version } from "../../package.json";

test("health check endpoint returns 200", async () => {
  const res = await fetch("http://localhost:3000/api/v1/health-check");
  expect(res.status).toBe(200);
  expect(await res.text()).toBe("ok");
});

test("version endpoint returns version", async () => {
  const res = await fetch("http://localhost:3000/api/v1/version");
  expect(res.status).toBe(200);
  expect(await res.text()).toBe(version);
});

test("unknown endpoint returns 404", async () => {
  const res = await fetch("http://localhost:3000/unknown");
  expect(res.status).toBe(404);
});
