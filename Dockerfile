# Etapa de build
FROM node:20.19.0-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Etapa de produção
FROM node:20.19.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/.output /app/.output

RUN yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
