# Base image
FROM oven/bun:1.0.29 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Build the application (if needed)
RUN bun run build

# Production image
FROM oven/bun:1.0.29-slim

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bun.lockb ./bun.lockb
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/src/models ./src/models
COPY --from=builder /app/src/config/db.config.ts ./src/config/db.config.ts

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "start"]