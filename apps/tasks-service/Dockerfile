FROM node:20-alpine AS base
RUN npm install -g pnpm

# Development stage
FROM base AS development
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all packages
COPY packages ./packages

# Copy tasks-service package.json
COPY apps/tasks-service/package.json ./apps/tasks-service/

# Install all dependencies
RUN pnpm install

# Copy tasks-service source
COPY apps/tasks-service ./apps/tasks-service

# Set working directory to tasks-service
WORKDIR /app/apps/tasks-service

# Expose port (not really used in microservices, but good for debugging)
EXPOSE 3003

CMD ["pnpm", "dev"]

# Builder stage
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/tasks-service/package.json ./apps/tasks-service/

RUN pnpm install

COPY apps/tasks-service ./apps/tasks-service

WORKDIR /app/apps/tasks-service

RUN pnpm build

# Production stage
FROM base AS production
WORKDIR /app

COPY --from=builder /app/apps/tasks-service/dist ./dist
COPY --from=builder /app/apps/tasks-service/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3003

CMD ["node", "dist/main"]
