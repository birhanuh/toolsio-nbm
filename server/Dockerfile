FROM node:9
WORKDIR /app
#COPY package-lock.json .
COPY package.json .
COPY migrations ./migrations
RUN npm install --production
ENV NODE_ENV production
COPY dist ./dist
COPY config ./config
COPY wait-for-it.sh .
RUN ls
RUN pwd
#CMD node dist/index.js
USER node