# Etapa de build
FROM node:20.19.0-alpine AS builder

# Build arguments
ARG VERDACCIO_TOKEN

WORKDIR /app

COPY package.json yarn.lock ./

# Configure Verdaccio registry authentication
RUN echo "@rblab:registry=https://npm.rodolfodebonis.com.br" > .npmrc && \
    echo "//npm.rodolfodebonis.com.br/:_authToken=${VERDACCIO_TOKEN}" >> .npmrc && \
    echo "registry=https://registry.npmjs.org/" >> .npmrc

# Install dependencies
RUN yarn install --frozen-lockfile

# Remove .npmrc for security
RUN rm -f .npmrc

COPY . .
RUN yarn build

# Etapa de produção
FROM node:20.19.0-alpine AS production

# Build arguments
ARG VERDACCIO_TOKEN

WORKDIR /app

COPY --from=builder /app/.output /app/.output

# Copy package files for production dependencies
COPY --from=builder /app/package.json /app/yarn.lock ./

# Configure Verdaccio registry authentication for production dependencies
RUN echo "@rblab:registry=https://npm.rodolfodebonis.com.br" > .npmrc && \
    echo "//npm.rodolfodebonis.com.br/:_authToken=${VERDACCIO_TOKEN}" >> .npmrc && \
    echo "registry=https://registry.npmjs.org/" >> .npmrc

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Remove .npmrc for security
RUN rm -f .npmrc

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
