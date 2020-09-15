FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/xivtgnews

# Install app dependencies

COPY XIVNotifier.js ./
COPY package.json ./
COPY package-lock.json ./

RUN npm install

CMD [ "node", "XIVNotifier.js" ]
