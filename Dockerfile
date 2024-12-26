FROM oven/bun:1.1.42-slim

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile --production

CMD ["bun", "run", "launch"]
