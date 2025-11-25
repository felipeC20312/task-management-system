FROM node:20-alpine AS base
RUN npm install -g pnpm@latest

FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages ./packages
RUN pnpm install --frozen-lockfile
COPY apps/auth-service ./apps/auth-service
CMD ["pnpm", "--filter", "auth-service", "dev"]

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages ./packages
RUN pnpm install --frozen-lockfile
COPY apps/auth-service ./apps/auth-service
RUN pnpm --filter auth-service build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth-service/package.json ./
CMD ["node", "dist/main"]
