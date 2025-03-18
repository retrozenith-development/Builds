# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY docs/package.json docs/pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY docs/ .

# Build the application
RUN pnpm build

# Stage 2: Create production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app will run on
EXPOSE 3000

# Environment variables
ENV PORT 3000
ENV NODE_ENV production
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"] 