# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Install TypeScript
RUN npm install --save-exact --save-dev typescript

# Fix permissions
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Copy source files
COPY . .

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]
