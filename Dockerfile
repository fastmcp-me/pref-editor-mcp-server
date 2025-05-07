FROM node:22.15-alpine

RUN mkdir -p /app

WORKDIR /app

COPY . /app/

RUN npm ci --ignore-scripts --omit-dev

ENV ADB_HOST="host.docker.internal"

ENTRYPOINT ["node", "dist/index.js"]