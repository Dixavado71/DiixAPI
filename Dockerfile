# Stage 1: Build
FROM node:20-bookworm AS builder

WORKDIR /app

# Install dependencies (root)
COPY package*.json ./
RUN npm ci

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build frontend
RUN cd frontend && npm run build

# Build TypeScript
RUN npm run build:backend

# Stage 2: Production
FROM node:20-bookworm

WORKDIR /app

# Install production dependencies only (root)
COPY package*.json ./
RUN npm ci --only=production

# Install frontend production dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/frontend/dist ./frontend/dist

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

USER nodejs

# Expose port (will be overridden by Railway)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["node", "dist/server.js"]
