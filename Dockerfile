# Etapa de build
FROM node:18.20.5-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Etapa de produção
FROM node:18.20.5-alpine AS production

WORKDIR /app

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/ecosystem.config.js /app/ecosystem.config.js

RUN yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "start"]
