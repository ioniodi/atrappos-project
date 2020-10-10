# Dockerfile
FROM node:12.16.1-alpine3.11

# upgrade docker packages
RUN apk --no-cache add --update bash git libgcc libstdc++ linux-headers && \
    rm -rf /var/cache/apk/*

ARG THUNDERFOREST_API_KEY
ARG STADIA_API_KEY
ARG GA_ID
ARG SERVER_URL
ARG DESKTOP_APP_URL
ARG NODE_ENV
ARG BABEL_ENV
ARG PORT

ENV THUNDERFOREST_API_KEY=$THUNDERFOREST_API_KEY
ENV STADIA_API_KEY=$STADIA_API_KEY
ENV GA_ID=$GA_ID
ENV SERVER_URL=$SERVER_URL
ENV DESKTOP_APP_URL=$DESKTOP_APP_URL
ENV NODE_ENV=$NODE_ENV
ENV BABEL_ENV=$BABEL_ENV
ENV PORT=$PORT

EXPOSE 4000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json /usr/src/app/

# Bundle app source
COPY . /usr/src/app
COPY package.json /usr/src/app/
RUN rm -rf ./node_modules || echo "I cant find Node Modules Folder"
RUN rm -rf ./build || echo "I cant find Build Folder"

RUN npm install --build-from-source=bcrypt
RUN npm install -g serve
RUN npm run build -p

CMD ["serve", "-s", "build"]
