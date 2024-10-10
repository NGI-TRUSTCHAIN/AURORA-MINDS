# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.3.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm i

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
CMD ["npm", "run", "dev", "--", "--host"]
