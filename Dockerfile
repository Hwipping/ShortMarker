FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY manifest.json ./manifest.json
COPY src ./src
COPY scripts ./scripts
COPY test ./test

CMD ["npm", "test"]
