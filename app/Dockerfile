# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# Build stage
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source files
COPY --link . .

# Build the TypeScript/Next.js app (assuming Next.js or similar)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Remove dev dependencies and install only production dependencies
RUN rm -rf node_modules && \
    npm ci --production

# Production stage
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN useradd -m appuser

# Copy built app and production dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/type ./type

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
USER appuser

EXPOSE 3000
CMD ["npm", "start"]
