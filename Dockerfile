# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:22.13.1-alpine AS builder

# Set the working directory in the container
WORKDIR /app

RUN apk add --update python3 make g++

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Build the Nuxt 3 application for production
# Copy the rest of the application code to the container
COPY . .

RUN yarn generate



# Use a smaller production image
FROM nginx:stable-alpine AS production

COPY --from=builder /app/.output/public /usr/share/nginx/html


COPY ./.config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
