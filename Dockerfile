# Build stage
FROM node:20.19.0-alpine AS builder

ARG VERDACCIO_TOKEN

WORKDIR /app

COPY package.json package-lock.json ./

# Configure Verdaccio registry authentication
RUN echo "@rblab:registry=https://npm.rodolfodebonis.com.br" > .npmrc && \
    echo "//npm.rodolfodebonis.com.br/:_authToken=${VERDACCIO_TOKEN}" >> .npmrc && \
    echo "registry=https://registry.npmjs.org/" >> .npmrc

# Install dependencies
RUN npm ci

# Remove .npmrc for security
RUN rm -f .npmrc

COPY . .
RUN npm run build

# Production stage
FROM node:20.19.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/.output /app/.output

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
