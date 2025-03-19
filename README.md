# RetroZenith Builds - Docker Deployment

This repository contains a dockerized Next.js application for RetroZenith Builds. The site is designed to display Android ROM downloads in a clean, modern interface.

## Docker Setup

### Prerequisites

- Docker and Docker Compose installed on your machine or server
- Git for cloning the repository

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Builds
   ```

2. Start the application with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

4. To stop the application:
   ```bash
   docker-compose down
   ```

### Production Deployment

#### Using GitHub Container Registry

The GitHub Actions workflow automatically builds and pushes the Docker image to GitHub Container Registry (ghcr.io) when changes are pushed to the main branch.

To pull and run the latest image:

```bash
docker pull ghcr.io/<username>/Builds/retrozenith-builds:latest
docker run -d -p 3000:3000 ghcr.io/<username>/Builds/retrozenith-builds:latest
```

#### Using Docker Compose in Production

Create a `docker-compose.prod.yml` file for production:

```yaml
version: '3.8'

services:
  website:
    image: ghcr.io/<username>/Builds/retrozenith-builds:latest
    container_name: retrozenith-builds
    ports:
      - "3000:3000"
    restart: always
    environment:
      - NODE_ENV=production
```

Then run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Customization

### Environment Variables

You can customize the application behavior by setting environment variables in your Docker Compose file or when running the Docker container.

Example:
```yaml
services:
  website:
    image: retrozenith-builds:latest
    environment:
      - CUSTOM_DOMAIN=cdn.zenyhosting.cloud
      - OTHER_VARIABLE=value
```

## Building Locally

To build the Docker image locally:

```bash
cd docs
docker build -t retrozenith-builds:local .
```

## Project Structure

- `docs/` - Next.js application code
- `docs/Dockerfile` - Docker configuration for the Next.js app
- `docker-compose.yml` - Docker Compose configuration for local development
- `.github/workflows/deploy.yml` - CI/CD pipeline for building and publishing Docker images 