## Running the Project with Docker

This project includes Docker support for streamlined local development and deployment. The main application is built with Node.js (version `22.13.1` as specified in the Dockerfile) and runs on port `3000`.

### Requirements
- Docker (latest recommended)
- Docker Compose

### Environment Variables
- The application can use environment variables from `.env.local`. Uncomment the `env_file` line in `compose.yaml` if you wish to provide custom environment variables.

### Build and Run Instructions
1. **Build and start the app:**
   ```sh
   docker compose up --build
   ```
   This will build the image from `./app/Dockerfile` and start the service `ts-app`.

2. **Access the app:**
   - The application will be available at [http://localhost:3000](http://localhost:3000)

### Ports
- `ts-app` service exposes port `3000` (mapped to your local machine).

### Special Configuration
- The Dockerfile uses a multi-stage build for optimized image size and security.
- The app runs as a non-root user (`appuser`) for improved security.
- No external dependencies (such as databases or caches) are required for this setup.

---

For more details on the Docker setup, see `README.Docker.md`.