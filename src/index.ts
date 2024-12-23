import { version } from "../package.json";

const server = Bun.serve({
  static: {
    "/api/health-check": new Response("ok"),
    "/api/version": new Response(version),
  },
  fetch: (req: Request) => {
    return new Response(`Endpoint not found: ${req.url}`, { status: 404 });
  },
  development: true,
});

console.log(`Listening on http://localhost:${server.port}`);
