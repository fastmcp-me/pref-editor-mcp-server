FROM node:22.15-alpine

# Use host's adb server
ENV PREF_EDITOR_ADB_HOST=host.docker.internal
ENV PREF_EDITOR_ADB_PORT=5037

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json .

# Install production dependencies only -- avoid running any scripts defined in package.json
RUN npm ci --ignore-scripts --omit-dev

# Copy the rest of the source
COPY . .

# Build the server
RUN npm run build

# Start the server silently (without npm logs to conform to MCP requirements on stdio transport)
ENTRYPOINT ["npm", "--silent", "run", "start"]