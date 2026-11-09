FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY packages/ ./packages/
COPY mcp/ ./mcp/

ENV NODE_ENV=production

ENTRYPOINT ["node", "packages/gmpsignal-mcp/bin/cli.mjs"]
