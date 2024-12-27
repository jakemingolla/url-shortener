import { expect, test, afterEach } from "bun:test";

let createdRedirects: string[] = [];

afterEach(async () => {
  for (const id of createdRedirects) {
    await fetch(`http://localhost:3000/api/v1/redirects/${id}`, {
      method: "DELETE",
    });
  }
  createdRedirects = [];
});

test("seeded redirect returns 302", async () => {
  const res = await fetch("http://localhost:3000/r/local", {
    redirect: "manual",
  });
  expect(res.status).toBe(302);
  expect(res.headers.get("Location")).toBe("https://google.com");
});

test("missing redirect returns 404", async () => {
  const res = await fetch("http://localhost:3000/r/not-found");
  expect(res.status).toBe(404);
});

test("increments the hit count", async () => {
  const create = await fetch("http://localhost:3000/api/v1/redirects", {
    method: "POST",
    body: JSON.stringify({ destination: "https://google.com" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { id } = await create.json();
  createdRedirects.push(id);

  const res = await fetch(`http://localhost:3000/r/${id}`, {
    redirect: "manual",
  });
  expect(res.status).toBe(302);

  const after = await fetch(`http://localhost:3000/api/v1/redirects/${id}`);
  expect(after.status).toBe(200);
  const json = await after.json();
  expect(json.hits).toBe(1);
  expect(json.updatedAt >= json.createdAt);
});
