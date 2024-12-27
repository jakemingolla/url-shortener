import { expect, test, afterEach } from "bun:test";

let createdRedirects: string[] = [];

afterEach(() => {
  createdRedirects.forEach((id) => {
    fetch(`http://localhost:3000/redirects/${id}`, { method: "DELETE" });
  });
  createdRedirects = [];
});

test("can create a redirect", async () => {
  const res = await fetch("http://localhost:3000/api/v1/redirects", {
    method: "POST",
    body: JSON.stringify({ destination: "https://google.com" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { id } = await res.json();
  createdRedirects.push(id);

  expect(res.status).toBe(200);
});

test("can update a redirect", async () => {
  const first = await fetch("http://localhost:3000/api/v1/redirects", {
    method: "POST",
    body: JSON.stringify({ destination: "https://google.com" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { id } = await first.json();
  createdRedirects.push(id);

  const second = await fetch(`http://localhost:3000/api/v1/redirects/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ destination: "https://bing.com" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  expect(second.status).toBe(200);
  const result = await second.json();
  expect(result.id).toBe(id);

  const third = await fetch(`http://localhost:3000/r/${id}`, {
    redirect: "manual",
  });
  expect(third.status).toBe(302);
  expect(third.headers.get("Location")).toBe("https://bing.com");
});

test("can delete a redirect", async () => {
  const create = await fetch("http://localhost:3000/api/v1/redirects", {
    method: "POST",
    body: JSON.stringify({ destination: "https://google.com" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { id } = await create.json();
  createdRedirects.push(id);

  const next = await fetch(`http://localhost:3000/api/v1/redirects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  expect(next.status).toBe(200);
  expect(next.json()).resolves.toEqual({ id });

  const after = await fetch(`http://localhost:3000/api/v1/redirects/${id}`);
  expect(after.status).toBe(404);

  const redirect = await fetch(`http://localhost:3000/r/${id}`);
  expect(redirect.status).toBe(404);
});

test("can delete a missing redirect", async () => {
  const res = await fetch("http://localhost:3000/api/v1/redirects/not-found", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  expect(res.status).toBe(200);
});
