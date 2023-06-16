FROM node:18.16.0
LABEL authors="rodolfodebonis"

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

COPY . /usr/src/nuxt-app/

RUN rm -rf node_modules

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
