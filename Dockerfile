# Build stage
FROM oven/bun:1.0.29 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies for building
RUN bun install --frozen-lockfile

# Copy only necessary files for building
COPY tsconfig*.json ./
COPY drizzle.config.ts ./
COPY src ./src

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1.0.29-slim

WORKDIR /app

# Copy only the necessary built files and configurations
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Install only production dependencies
RUN bun install --frozen-lockfile --production

EXPOSE 8888

CMD ["bun", "run", "start"]