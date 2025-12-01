FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages ./packages
RUN pnpm install
COPY apps/api-gateway ./apps/api-gateway
CMD ["pnpm", "--filter", "api-gateway", "dev"]

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages ./packages
RUN pnpm install
COPY apps/api-gateway ./apps/api-gateway
RUN pnpm --filter api-gateway build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/package.json ./
CMD ["node", "dist/main"]
