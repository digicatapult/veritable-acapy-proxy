# syntax=docker/dockerfile:1.0.0-experimental

FROM node:14.17.0-alpine

# Allow log level to be controlled. Uses an argument name that is different
# from the existing environment variable, otherwise the environment variable
# shadows the argument.
ARG LOGLEVEL
ENV NPM_CONFIG_LOGLEVEL ${LOGLEVEL}

# Install base dependencies
RUN npm -g install npm@latest

WORKDIR /vitalam-service-template

COPY . .
RUN npm install --production

EXPOSE 80
CMD ["node", "./app/index.js"]
