# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Set working directory
WORKDIR /app

# Copy docs files
COPY docs/ /app/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build the application - production build, not static export
ENV NODE_ENV=production
RUN pnpm build

# Expose the port the app will run on
EXPOSE 3000

# Environment variables
ENV NODE_ENV production

# Install serve to run the built app
RUN npm install -g serve

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]