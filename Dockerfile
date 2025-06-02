FROM node:18.20.5-slim AS builder

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn generate

FROM nginx:stable-alpine AS production

COPY --from=builder /app/.output/public /usr/share/nginx/html

COPY ./.config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
