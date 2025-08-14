# Base image with Bun
FROM oven/bun:alpine AS base
WORKDIR /app
COPY package.json ./
# Copy lockfile if it exists
COPY bun.lock* ./

# Install only production dependencies
FROM base AS prod-deps
ENV NODE_ENV=production
RUN bun install --frozen-lockfile --production

# Install all dependencies for building
FROM base AS build-deps
RUN bun install --frozen-lockfile

# Build stage
FROM build-deps AS build
COPY . .
RUN --mount=type=secret,id=PUBLIC_CLERK_PUBLISHABLE_KEY \
    --mount=type=secret,id=CLERK_SECRET_KEY \
    --mount=type=secret,id=PUBLIC_API_URL \
    export PUBLIC_CLERK_PUBLISHABLE_KEY=$(cat /run/secrets/PUBLIC_CLERK_PUBLISHABLE_KEY) && \
    export CLERK_SECRET_KEY=$(cat /run/secrets/CLERK_SECRET_KEY) && \
    export PUBLIC_API_URL=$(cat /run/secrets/PUBLIC_API_URL) && \
    bun run build

# Production image
FROM oven/bun:alpine AS runtime
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80/tcp
ENTRYPOINT ["bun", "run", "./dist/server/entry.mjs"]
