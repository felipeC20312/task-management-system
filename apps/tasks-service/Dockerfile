FROM node:20-alpine AS base
RUN npm install -g pnpm@latest

FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY packages ./packages
RUN pnpm install
COPY apps/tasks-service ./apps/tasks-service
CMD ["pnpm", "--filter", "tasks-service", "dev"]

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY packages ./packages
RUN pnpm install
COPY apps/tasks-service ./apps/tasks-service
RUN pnpm --filter tasks-service build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/apps/tasks-service/dist ./dist
COPY --from=builder /app/apps/tasks-service/package.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]
