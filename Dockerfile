FROM node:22.15-alpine

# Use host's adb server
ENV PREF_EDITOR_ADB_HOST=host.docker.internal
ENV PREF_EDITOR_ADB_PORT=5037

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json .

RUN npm ci --ignore-scripts --omit-dev

# Copy the rest of the source
COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]