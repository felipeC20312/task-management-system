FROM node:20-alpine AS base
RUN npm install -g pnpm@latest

FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages ./packages
RUN pnpm install
COPY apps/web ./apps/web
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages ./packages
RUN pnpm install
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN pnpm run build

FROM nginx:alpine AS production
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
