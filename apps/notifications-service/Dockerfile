FROM node:20-alpine AS base
RUN npm install -g pnpm@latest

FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY packages ./packages
RUN pnpm install
COPY apps/notifications-service ./apps/notifications-service
CMD ["pnpm", "--filter", "notifications-service", "dev"]

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY packages ./packages
RUN pnpm install
COPY apps/notifications-service ./apps/notifications-service
RUN pnpm --filter notifications-service build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/apps/notifications-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/notifications-service/package.json ./
CMD ["node", "dist/main"]
